<#
.SYNOPSIS
    Reads an Excel file, cleans data, aggregates by a group column,
    and writes a formatted report (summary table + chart + cleaned sheet)
    to a new Excel workbook.

.NOTES
    Prerequisites : ImportExcel module  (Install-Module ImportExcel -Scope CurrentUser)
    Tested with   : PowerShell 5.1 and PowerShell 7+

.EXAMPLE
    # Run manually
    pwsh -NonInteractive -NoProfile -File ".\Process-ExcelData.ps1"

    # Run with a custom config
    pwsh -NonInteractive -NoProfile -File ".\Process-ExcelData.ps1" -ConfigPath "D:\custom\config.json"
#>
[CmdletBinding()]
param(
    [string]$ConfigPath = "$PSScriptRoot\config.json"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Logging helper
# ---------------------------------------------------------------------------
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $ts   = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$ts] [$Level] $Message"
    Write-Host $line
    if ($script:LogFile) {
        Add-Content -Path $script:LogFile -Value $line -ErrorAction SilentlyContinue
    }
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
try {

    # ── Load configuration ────────────────────────────────────────────────
    if (-not (Test-Path $ConfigPath)) { throw "Config file not found: $ConfigPath" }
    $cfg = Get-Content -Raw $ConfigPath | ConvertFrom-Json

    $script:LogFile = $cfg.LogFile
    foreach ($dir in @((Split-Path $cfg.LogFile -Parent), (Split-Path $cfg.OutputFile -Parent))) {
        if ($dir) { $null = New-Item -ItemType Directory -Force -Path $dir }
    }

    Write-Log "=== Excel Processor Started ==="
    Write-Log "Input : $($cfg.InputFile)"
    Write-Log "Output: $($cfg.OutputFile)"

    # ── Ensure ImportExcel module ─────────────────────────────────────────
    if (-not (Get-Module -ListAvailable -Name ImportExcel)) {
        Write-Log "ImportExcel not found — installing (requires internet)..." "WARN"
        Install-Module ImportExcel -Scope CurrentUser -Force -AllowClobber
    }
    Import-Module ImportExcel -ErrorAction Stop
    Write-Log "ImportExcel module ready."

    # ── Read input workbook ───────────────────────────────────────────────
    if (-not (Test-Path $cfg.InputFile)) { throw "Input file not found: $($cfg.InputFile)" }

    $raw = Import-Excel -Path $cfg.InputFile -WorksheetName $cfg.InputSheet
    Write-Log "Read $($raw.Count) rows from sheet '$($cfg.InputSheet)'."

    # ---------------------------------------------------------------------------
    # TODO: Update these three column names in config.json once you share your file
    # ---------------------------------------------------------------------------
    $colGroup = $cfg.Columns.GroupByColumn   # e.g. "Category", "Department", "Region"
    $colValue = $cfg.Columns.ValueColumn     # e.g. "Amount", "Sales", "Count"
    $colDate  = $cfg.Columns.DateColumn      # e.g. "Date" — set to "" in config to skip

    # ── Clean data ────────────────────────────────────────────────────────
    Write-Log "Cleaning data..."

    $cleaned = $raw | Where-Object {
        -not [string]::IsNullOrWhiteSpace($_.$colGroup) -and
        -not [string]::IsNullOrWhiteSpace($_.$colValue)
    } | ForEach-Object {
        $row = $_

        # Trim whitespace from every string column
        $row.PSObject.Properties |
            Where-Object { $_.Value -is [string] } |
            ForEach-Object { $row.($_.Name) = $_.Value.Trim() }

        # Coerce value column to a number
        $num = 0.0
        if ([double]::TryParse(
                [string]$row.$colValue,
                [System.Globalization.NumberStyles]::Any,
                [System.Globalization.CultureInfo]::InvariantCulture,
                [ref]$num)) {
            $row.$colValue = $num
        }

        # Parse date column when configured
        if ($colDate -and $row.$colDate) {
            $dt = [datetime]::MinValue
            if ([datetime]::TryParse([string]$row.$colDate, [ref]$dt)) {
                $row.$colDate = $dt
            }
        }

        $row
    }

    $removed = $raw.Count - $cleaned.Count
    Write-Log "Removed $removed blank/invalid rows — $($cleaned.Count) rows remain."

    # ── Aggregate ─────────────────────────────────────────────────────────
    Write-Log "Aggregating by '$colGroup'..."

    $summary = $cleaned |
        Group-Object -Property $colGroup |
        ForEach-Object {
            $vals = $_.Group | ForEach-Object { [double]$_.$colValue }
            [PSCustomObject]@{
                $colGroup  = $_.Name
                "Count"    = $_.Count
                "Sum"      = [Math]::Round(($vals | Measure-Object -Sum).Sum,     2)
                "Average"  = [Math]::Round(($vals | Measure-Object -Average).Average, 2)
                "Min"      = ($vals | Measure-Object -Minimum).Minimum
                "Max"      = ($vals | Measure-Object -Maximum).Maximum
            }
        } |
        Sort-Object Sum -Descending

    Write-Log "Summary has $($summary.Count) groups."

    # ── Export formatted report ───────────────────────────────────────────
    Write-Log "Writing report..."
    if (Test-Path $cfg.OutputFile) { Remove-Item $cfg.OutputFile -Force }

    # Rows: 1 = header, 2..(n+1) = data
    # Column layout: A=$colGroup  B=Count  C=Sum  D=Average  E=Min  F=Max
    $n        = $summary.Count
    $dataRows = if ($n -gt 0) { "2:$($n + 1)" } else { "2:2" }

    $chartDef = New-ExcelChartDefinition `
        -ChartType    ColumnClustered `
        -XRange       "A2:A$($n + 1)" `
        -YRange       "C2:C$($n + 1)" `
        -SeriesHeader "Sum of $colValue" `
        -Title        "$colGroup — Sum of $colValue" `
        -Column 8 -Row 2 -Width 600 -Height 350

    # Sheet 1 — Summary with chart
    $pkg = $summary | Export-Excel `
        -Path                 $cfg.OutputFile `
        -WorksheetName        "Summary" `
        -TableName            "SummaryTable" `
        -TableStyle           Medium6 `
        -AutoSize `
        -BoldTopRow `
        -FreezeTopRow `
        -ExcelChartDefinition $chartDef `
        -PassThru

    # Sheet 2 — Full cleaned data
    $cleaned | Export-Excel `
        -ExcelPackage  $pkg `
        -WorksheetName "Cleaned Data" `
        -TableName     "CleanedTable" `
        -TableStyle    Medium2 `
        -AutoSize `
        -BoldTopRow `
        -FreezeTopRow

    Close-ExcelPackage $pkg

    Write-Log "Report saved: $($cfg.OutputFile)"
    Write-Log "=== Excel Processor Finished ==="
    exit 0

} catch {
    Write-Log "FATAL: $_" "ERROR"
    Write-Log $_.ScriptStackTrace "ERROR"
    exit 1
}

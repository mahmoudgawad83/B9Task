<#
.SYNOPSIS
    Registers Process-ExcelData.ps1 as a Windows Scheduled Task.

.NOTES
    Must be run ONCE as Administrator.

.EXAMPLE
    # Daily at 07:00
    .\Setup-ScheduledTask.ps1

    # Weekly on Friday at 06:00
    .\Setup-ScheduledTask.ps1 -Frequency Weekly -TriggerTime "06:00" -DayOfWeek Friday

    # Run at every logon
    .\Setup-ScheduledTask.ps1 -Frequency AtLogon
#>
[CmdletBinding()]
param(
    [string]$ScriptPath  = "$PSScriptRoot\Process-ExcelData.ps1",
    [string]$TaskName    = "ExcelDataProcessor",
    [string]$TaskFolder  = "\CustomTasks",
    [string]$TriggerTime = "07:00",

    [ValidateSet("Daily", "Weekly", "AtLogon")]
    [string]$Frequency   = "Daily",

    [ValidateSet("Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday")]
    [string]$DayOfWeek   = "Monday"
)

# ── Require Administrator ──────────────────────────────────────────────────
$id  = [Security.Principal.WindowsIdentity]::GetCurrent()
$pr  = [Security.Principal.WindowsPrincipal]$id
if (-not $pr.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error "Run this script as Administrator (right-click → Run as administrator)."
    exit 1
}

# ── Resolve PowerShell executable ─────────────────────────────────────────
# Prefer PowerShell 7 (pwsh); fall back to Windows PowerShell
$pwshPath = (Get-Command pwsh        -ErrorAction SilentlyContinue)?.Source ??
            (Get-Command powershell   -ErrorAction SilentlyContinue)?.Source
if (-not $pwshPath) { throw "Cannot locate pwsh or powershell.exe." }
Write-Host "Using shell : $pwshPath"

# ── Build trigger ──────────────────────────────────────────────────────────
$trigger = switch ($Frequency) {
    "Daily"   { New-ScheduledTaskTrigger -Daily  -At $TriggerTime }
    "Weekly"  { New-ScheduledTaskTrigger -Weekly -At $TriggerTime -DaysOfWeek $DayOfWeek }
    "AtLogon" { New-ScheduledTaskTrigger -AtLogOn }
}

# ── Build action ───────────────────────────────────────────────────────────
$argString = "-NonInteractive -NoProfile -ExecutionPolicy Bypass -File `"$ScriptPath`""
$action    = New-ScheduledTaskAction -Execute $pwshPath -Argument $argString

# ── Task settings ──────────────────────────────────────────────────────────
$settings = New-ScheduledTaskSettingsSet `
    -StartWhenAvailable `
    -ExecutionTimeLimit  (New-TimeSpan -Hours 1) `
    -MultipleInstances   IgnoreNew `
    -Hidden

$principal = New-ScheduledTaskPrincipal `
    -UserId    $env:USERNAME `
    -LogonType Interactive `
    -RunLevel  Highest

# ── Register ───────────────────────────────────────────────────────────────
try {
    $task = Register-ScheduledTask `
        -TaskName  $TaskName `
        -TaskPath  $TaskFolder `
        -Action    $action `
        -Trigger   $trigger `
        -Settings  $settings `
        -Principal $principal `
        -Force

    Write-Host ""
    Write-Host "Task registered successfully!" -ForegroundColor Green
    Write-Host "  Path    : $($task.TaskPath)$($task.TaskName)"
    Write-Host "  Trigger : $Frequency$(if ($Frequency -ne 'AtLogon') { " at $TriggerTime" })"
    Write-Host "  Script  : $ScriptPath"
    Write-Host ""
    Write-Host "Useful commands:"
    Write-Host "  Run now : Start-ScheduledTask  -TaskPath '$TaskFolder' -TaskName '$TaskName'"
    Write-Host "  Remove  : Unregister-ScheduledTask -TaskPath '$TaskFolder' -TaskName '$TaskName' -Confirm:`$false"

} catch {
    Write-Error "Failed to register task: $_"
    exit 1
}

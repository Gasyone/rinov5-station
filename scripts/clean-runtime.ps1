Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repo = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$currentPid = $PID

function Get-AncestorProcessIds {
  param([int]$ProcessId)

  $ids = New-Object System.Collections.Generic.HashSet[int]
  $cursor = $ProcessId

  while ($cursor -gt 0) {
    if (-not $ids.Add($cursor)) {
      break
    }

    $process = Get-CimInstance Win32_Process -Filter "ProcessId = $cursor" -ErrorAction SilentlyContinue
    if ($null -eq $process) {
      break
    }

    $cursor = [int]$process.ParentProcessId
  }

  return $ids
}

$protectedProcessIds = Get-AncestorProcessIds -ProcessId $currentPid

$runtimeProcesses = @(Get-CimInstance Win32_Process | Where-Object {
  $_.Name -match '^(node|cmd|npm|npx|java|javaw)\.exe$' -and
  $_.CommandLine -like "*$repo*" -and
  -not $protectedProcessIds.Contains([int]$_.ProcessId)
})

foreach ($process in $runtimeProcesses) {
  try {
    Stop-Process -Id $process.ProcessId -Force -ErrorAction Stop
    Write-Host "Stopped $($process.Name) $($process.ProcessId)"
  } catch {
    Write-Warning "Could not stop $($process.Name) $($process.ProcessId): $($_.Exception.Message)"
  }
}

Start-Sleep -Milliseconds 500

$cachePaths = @(
  (Join-Path $repo '.next\dev'),
  (Join-Path $repo '.next\cache')
)

foreach ($cachePath in $cachePaths) {
  $resolvedPath = if (Test-Path -LiteralPath $cachePath) {
    (Resolve-Path -LiteralPath $cachePath).Path
  } else {
    $cachePath
  }

  if (-not $resolvedPath.StartsWith($repo, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to remove path outside repository: $resolvedPath"
  }

  if (Test-Path -LiteralPath $cachePath) {
    Remove-Item -LiteralPath $cachePath -Recurse -Force
    Write-Host "Cleared $cachePath"
  }
}

$remaining = @(Get-CimInstance Win32_Process | Where-Object {
  $_.Name -match '^(node|cmd|npm|npx|java|javaw)\.exe$' -and
  $_.CommandLine -like "*$repo*" -and
  -not $protectedProcessIds.Contains([int]$_.ProcessId)
})

if ($remaining.Count -gt 0) {
  Write-Warning "Remaining Rinov5 runtime processes: $($remaining.Count)"
  $remaining | Select-Object ProcessId,Name,CommandLine | Format-Table -Wrap
} else {
  Write-Host 'Rinov5 runtime is clean.'
}

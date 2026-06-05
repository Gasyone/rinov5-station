$folder = "c:\Users\Jacky Tran\Documents\Rinov5\docs\business-functions"
$backendReplace = "**H" + [char]0x1EC7 + " th" + [char]0x1ED1 + "ng n" + [char]0x1EC1 + "n:**"
$frontendReplace = "**Giao di" + [char]0x1EC7 + "n:**"

Get-ChildItem "$folder\BF-*.md" | ForEach-Object {
    $content = [System.IO.File]::ReadAllText($_.FullName)
    $updated = $content -replace '\*\*Backend:\*\*', $backendReplace
    $updated = $updated -replace '\*\*Frontend:\*\*', $frontendReplace
    if ($updated -ne $content) {
        [System.IO.File]::WriteAllText($_.FullName, $updated)
        Write-Host "Updated: $($_.Name)"
    }
}

$ErrorActionPreference = 'Stop'
$source = 't:\Git Project\Cognivanta'
$dest = 't:\Git Project\Cognivanta-Enterprise-Platform.zip'
$innerDest = 't:\Git Project\Cognivanta\Cognivanta-Enterprise-Platform.zip'

if (Test-Path $dest) { Remove-Item -Force $dest }
if (Test-Path $innerDest) { Remove-Item -Force $innerDest }

Add-Type -AssemblyName System.IO.Compression.FileSystem
$compressionLevel = [System.IO.Compression.CompressionLevel]::Optimal

Write-Host "[*] Archiving $source into $dest..."
$zip = [System.IO.Compression.ZipFile]::Open($dest, [System.IO.Compression.ZipArchiveMode]::Create)

$files = Get-ChildItem -Path $source -Recurse -Force | Where-Object {
    $_.FullName -notmatch '\\node_modules($|\\)' -and
    $_.FullName -notmatch '\\dist($|\\)' -and
    $_.FullName -notmatch '\\.turbo($|\\)' -and
    $_.FullName -notmatch '\\.vite($|\\)' -and
    $_.FullName -notmatch 'Cognivanta-Enterprise-Platform\.zip$'
}

$count = 0
foreach ($file in $files) {
    if (-not $file.PSIsContainer) {
        $relativePath = $file.FullName.Substring($source.Length + 1)
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $relativePath, $compressionLevel) | Out-Null
        $count++
    }
}

$zip.Dispose()

Copy-Item -Path $dest -Destination $innerDest -Force

$size = (Get-Item $dest).Length / 1MB
Write-Host "[+] SUCCESS! Archived $count files (including .git) to:"
Write-Host "    $dest ($([math]::Round($size, 2)) MB)"
Write-Host "    $innerDest ($([math]::Round($size, 2)) MB)"

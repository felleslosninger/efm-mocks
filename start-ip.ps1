param (
[Parameter(Mandatory=$true)][string]$ipJar
)
Start-Job -ScriptBlock {
  & .\start.cmd $ipJar
} -Name integrasjonpunktet
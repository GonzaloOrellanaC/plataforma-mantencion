param(
    [string]$ref = "main"
)

$repo = 'GonzaloOrellanaC/plataforma-mantencion'
Write-Host "Dispatching e2e workflow for $repo@$ref"
gh workflow run e2e.yml --repo $repo --ref $ref
Write-Host "Workflow dispatched. Use 'gh run list --repo $repo' to monitor runs."

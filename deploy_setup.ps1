# deploy_setup.ps1 - Git & GitHub Pages Setup Helper for Team Vayusat Website

Write-Host "" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 Team Vayusat Git & GitHub Pages Deployment Assistant" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Initialize Git Repository if not already initialized
if (-not (Test-Path ".git")) {
    Write-Host "Step 1: Initializing a new Git repository..." -ForegroundColor Yellow
    git init
    # Set default branch name to main
    git checkout -b main
    Write-Host "✔ Git repository initialized successfully." -ForegroundColor Green
} else {
    Write-Host "✔ Git repository already initialized." -ForegroundColor Green
}
Write-Host ""

# Step 2: Stage and Commit Files
Write-Host "Step 2: Staging and committing all project files..." -ForegroundColor Yellow
git add .
git commit -m "Initial commit: Deploy Team Vayusat Website to GitHub Pages"
Write-Host "✔ All files committed to 'main' branch successfully." -ForegroundColor Green
Write-Host ""

# Step 3: Prompt for GitHub Remote Repository URL
Write-Host "Step 3: Connecting to GitHub..." -ForegroundColor Yellow
Write-Host "Please create a new repository on your GitHub account (https://github.com/new)." -ForegroundColor Gray
Write-Host "Name it something like 'team-vayusat' and leave 'Add .gitignore' and 'Add README' UNCHECKED." -ForegroundColor Gray
Write-Host ""
$remoteUrl = Read-Host "Paste your GitHub Repository URL (e.g., https://github.com/your-username/team-vayusat.git)"

if ([string]::IsNullOrWhiteSpace($remoteUrl)) {
    Write-Host "⚠ No URL entered. Setup paused." -ForegroundColor Yellow
    Write-Host "When you are ready, run these final commands manually:" -ForegroundColor Gray
    Write-Host "  git remote add origin <YOUR_GITHUB_REPO_URL>" -ForegroundColor Gray
    Write-Host "  git push -u origin main" -ForegroundColor Gray
    Exit
}

# Add Remote and Push
Write-Host ""
Write-Host "Adding remote origin..." -ForegroundColor Yellow

# Check if origin already exists
$existingRemote = git remote | Select-String "origin"
if ($existingRemote) {
    git remote remove origin
}

git remote add origin $remoteUrl
Write-Host "✔ Remote origin set successfully." -ForegroundColor Green
Write-Host ""

Write-Host "Pushing files to GitHub (main branch)..." -ForegroundColor Yellow
Write-Host "Note: If prompted by GitHub, please sign in via your browser or input your Personal Access Token." -ForegroundColor Gray
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "🎉 Success! Your code has been pushed to GitHub." -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "To enable GitHub Pages:" -ForegroundColor Yellow
    Write-Host "1. Go to your GitHub repository in your browser." -ForegroundColor Gray
    Write-Host "2. Click on 'Settings' (the gear icon on the top tab)." -ForegroundColor Gray
    Write-Host "3. In the left sidebar, click 'Pages' (under the Code and automation section)." -ForegroundColor Gray
    Write-Host "4. Under 'Build and deployment' -> 'Branch', select 'main' (or '/root')." -ForegroundColor Gray
    Write-Host "5. Click 'Save'." -ForegroundColor Gray
    Write-Host ""
    Write-Host "Within 1-2 minutes, your website will be live!" -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Green
} else {
    Write-Host "⚠ Pushing failed. Please verify your internet connection or GitHub credentials." -ForegroundColor Red
}

# PowerShell script to update all pages with modern colors

Write-Host "🎨 Updating all pages with modern colors..." -ForegroundColor Cyan

$pages = @(
    "src/pages/Contact.tsx",
    "src/pages/SavedLines.tsx",
    "src/pages/Community.tsx",
    "src/pages/Courses.tsx",
    "src/pages/ApiDocs.tsx",
    "src/components/Header.tsx",
    "src/components/Footer.tsx"
)

foreach ($page in $pages) {
    if (Test-Path $page) {
        Write-Host "Updating $page..." -ForegroundColor Yellow
        
        # Read content
        $content = Get-Content $page -Raw
        
        # Replace neon colors with modern colors
        $content = $content -replace 'from-neon-purple to-neon-pink', 'from-primary-500 to-secondary-600'
        $content = $content -replace 'from-neon-purple to-neon-cyan', 'from-primary-500 to-accent-600'
        $content = $content -replace 'from-neon-cyan to-neon-green', 'from-accent-500 to-success-600'
        $content = $content -replace 'from-neon-pink to-neon-yellow', 'from-secondary-500 to-warning-600'
        $content = $content -replace 'from-neon-green to-neon-cyan', 'from-success-500 to-accent-600'
        
        # Replace gradient text
        $content = $content -replace 'bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-green bg-clip-text text-transparent', 'gradient-text'
        $content = $content -replace 'bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent', 'gradient-text'
        
        # Replace card backgrounds
        $content = $content -replace 'bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-2xl p-8 border border-white/20 dark:border-neon-purple/20 shadow-xl', 'card p-8'
        $content = $content -replace 'bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg', 'bg-white dark:bg-dark-800'
        
        # Replace borders
        $content = $content -replace 'border-white/20 dark:border-neon-purple/20', 'border-gray-200 dark:border-dark-700'
        $content = $content -replace 'border-neon-purple/30', 'border-primary-300 dark:border-primary-700'
        
        # Replace text colors
        $content = $content -replace 'text-neon-cyan', 'text-primary-600 dark:text-primary-400'
        $content = $content -replace 'text-neon-purple', 'text-secondary-600 dark:text-secondary-400'
        $content = $content -replace 'text-neon-pink', 'text-accent-600 dark:text-accent-400'
        
        # Replace button gradients
        $content = $content -replace 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white', 'bg-gradient-primary text-white'
        
        # Write back
        Set-Content $page -Value $content -NoNewline
        
        Write-Host "✅ Updated $page" -ForegroundColor Green
    } else {
        Write-Host "⚠️  $page not found" -ForegroundColor Red
    }
}

Write-Host "`n🎉 All pages updated with modern colors!" -ForegroundColor Green
Write-Host "Run 'npm run dev' to see the changes" -ForegroundColor Cyan

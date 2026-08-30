# 生成「考研工作台」应用图标 app-icon.ico（多尺寸 PNG-in-ICO）
# 设计：靛蓝→紫对角渐变圆角方块 + 白色学士帽 + 金色帽穗
Add-Type -AssemblyName System.Drawing

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$pngPreview = Join-Path $scriptDir "app-icon-preview.png"
$icoPath = Join-Path $scriptDir "app-icon.ico"

function New-IconBitmap([int]$size) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $s = [double]$size

    # 圆角矩形背景
    $radius = $s * 0.22
    $rect = New-Object System.Drawing.RectangleF(0, 0, $s, $s)
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = [float]($radius * 2)
    $path.AddArc([float]0, [float]0, $d, $d, 180, 90)
    $path.AddArc([float]($s - $d), [float]0, $d, $d, 270, 90)
    $path.AddArc([float]($s - $d), [float]($s - $d), $d, $d, 0, 90)
    $path.AddArc([float]0, [float]($s - $d), $d, $d, 90, 90)
    $path.CloseFigure()

    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $rect,
        [System.Drawing.Color]::FromArgb(255, 99, 102, 241),  # 靛蓝
        [System.Drawing.Color]::FromArgb(255, 168, 85, 247),  # 紫罗兰
        45
    )
    $g.FillPath($bgBrush, $path)

    # 白色学士帽
    $white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $top = [System.Drawing.PointF[]]@(
        (New-Object System.Drawing.PointF([float]($s * 0.5),  [float]($s * 0.17))),
        (New-Object System.Drawing.PointF([float]($s * 0.80), [float]($s * 0.38))),
        (New-Object System.Drawing.PointF([float]($s * 0.5),  [float]($s * 0.59))),
        (New-Object System.Drawing.PointF([float]($s * 0.20), [float]($s * 0.38)))
    )
    $g.FillPolygon($white, $top)
    $g.FillRectangle($white, [float]($s * 0.18), [float]($s * 0.60), [float]($s * 0.64), [float]($s * 0.07))

    # 金色帽穗：线 + 穗端
    $gold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 251, 191, 36))
    $pen = New-Object System.Drawing.Pen($gold, [float][Math]::Max(2, $s * 0.022))
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $g.DrawLine($pen, [float]($s * 0.80), [float]($s * 0.38), [float]($s * 0.80), [float]($s * 0.74))
    $g.FillEllipse($gold, [float]($s * 0.80 - $s * 0.032), [float]($s * 0.74), [float]($s * 0.064), [float]($s * 0.11))

    $g.Dispose()
    return $bmp
}

# 256 预览图
$preview = New-IconBitmap 256
$preview.Save($pngPreview, [System.Drawing.Imaging.ImageFormat]::Png)
$preview.Dispose()
Write-Host "预览已生成: $pngPreview"

# 多尺寸合成 ICO（PNG-in-ICO，Vista+ 支持）
$sizes = @(256, 64, 48, 32, 16)
$ms = New-Object System.IO.MemoryStream
$bw = New-Object System.IO.BinaryWriter($ms)
$bw.Write([uint16]0)          # reserved
$bw.Write([uint16]1)          # type: icon
$bw.Write([uint16]$sizes.Count)
$offset = 6 + 16 * $sizes.Count
$pngBlobs = @()

foreach ($size in $sizes) {
    $bmp = New-IconBitmap $size
    $png = New-Object System.IO.MemoryStream
    $bmp.Save($png, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $pngBlobs += , $png.ToArray()
    $png.Dispose()
    $dim = if ($size -eq 256) { 0 } else { $size }  # ICO 规范：256 记 0
    $bw.Write([byte]$dim)  # width
    $bw.Write([byte]$dim)  # height
    $bw.Write([byte]0)  # palette
    $bw.Write([byte]0)  # reserved
    $bw.Write([uint16]1)  # planes
    $bw.Write([uint16]32) # bit count
    $bw.Write([uint32]$pngBlobs[-1].Length)
    $bw.Write([uint32]$offset)
    $offset += $pngBlobs[-1].Length
}

foreach ($blob in $pngBlobs) {
    $bw.Write($blob)
}
$bw.Flush()
[System.IO.File]::WriteAllBytes($icoPath, $ms.ToArray())
$bw.Dispose()
$ms.Dispose()
Write-Host "图标已生成: $icoPath ($($sizes -join '/'))"

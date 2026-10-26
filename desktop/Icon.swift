import Cocoa

let destination = CommandLine.arguments[1]
try FileManager.default.createDirectory(atPath: destination, withIntermediateDirectories: true)
let variants = [("16x16",16),("16x16@2x",32),("32x32",32),("32x32@2x",64),("128x128",128),("128x128@2x",256),("256x256",256),("256x256@2x",512),("512x512",512),("512x512@2x",1024)]
func color(_ r: CGFloat, _ g: CGFloat, _ b: CGFloat) -> NSColor { NSColor(calibratedRed:r/255,green:g/255,blue:b/255,alpha:1) }
for (name,size) in variants {
    let image = NSBitmapImageRep(bitmapDataPlanes:nil,pixelsWide:size,pixelsHigh:size,bitsPerSample:8,samplesPerPixel:4,hasAlpha:true,isPlanar:false,colorSpaceName:.deviceRGB,bytesPerRow:0,bitsPerPixel:0)!
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep:image)
    let context = NSGraphicsContext.current!.cgContext
    context.scaleBy(x:CGFloat(size)/1024,y:CGFloat(size)/1024)
    color(229,235,213).setFill(); NSBezierPath(roundedRect:NSRect(x:45,y:45,width:934,height:934),xRadius:205,yRadius:205).fill()
    color(203,215,182).setFill(); NSBezierPath(roundedRect:NSRect(x:120,y:155,width:784,height:680),xRadius:65,yRadius:65).fill()
    color(64,94,69).setFill(); NSBezierPath(roundedRect:NSRect(x:120,y:185,width:784,height:680),xRadius:65,yRadius:65).fill()
    color(93,123,91).setFill(); NSRect(x:154,y:741,width:716,height:72).fill()
    color(202,214,171).setFill(); for x in [185,226,267] { NSRect(x:x,y:765,width:17,height:17).fill() }
    // Pixel terminal chevron.
    color(232,239,208).setFill()
    for (x,y) in [(240,570),(275,535),(310,500),(275,465),(240,430)] { NSRect(x:x,y:y,width:42,height:42).fill() }
    NSRect(x:389,y:430,width:130,height:24).fill()
    // An original little desk plant: growing, one line at a time.
    color(211,164,121).setFill(); NSRect(x:627,y:308,width:110,height:82).fill(); NSRect(x:612,y:377,width:140,height:25).fill()
    color(169,193,126).setFill(); NSRect(x:674,y:402,width:20,height:160).fill(); NSRect(x:613,y:496,width:63,height:39).fill(); NSRect(x:595,y:520,width:59,height:37).fill(); NSRect(x:694,y:549,width:62,height:35).fill(); NSRect(x:727,y:576,width:51,height:30).fill()
    NSGraphicsContext.restoreGraphicsState()
    try image.representation(using:.png,properties:[:])!.write(to: URL(fileURLWithPath:destination).appendingPathComponent("icon_\(name).png"))
}

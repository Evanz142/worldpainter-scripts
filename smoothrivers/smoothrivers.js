try {
  var path = org.pepsoft.worldpainter.Configuration.getConfigDir().getAbsolutePath() + "\\plugins\\smoothrivers\\";

  // Loading in the 8 different water ground cover layers
  var waterLayer0 = wp.getLayer().fromFile(path + 'Water Layer 0.layer').go();
  var waterLayer1 = wp.getLayer().fromFile(path + 'Water Layer 1.layer').go();
  var waterLayer2 = wp.getLayer().fromFile(path + 'Water Layer 2.layer').go();
  var waterLayer3 = wp.getLayer().fromFile(path + 'Water Layer 3.layer').go();
  var waterLayer4 = wp.getLayer().fromFile(path + 'Water Layer 4.layer').go();
  var waterLayer5 = wp.getLayer().fromFile(path + 'Water Layer 5.layer').go();
  var waterLayer6 = wp.getLayer().fromFile(path + 'Water Layer 6.layer').go();
  var waterLayer7 = wp.getLayer().fromFile(path + 'Water Layer 7.layer').go();
} 
catch(err) {
  throw "Water layer files were not found, make sure the downloaded .layer files are in the same directory as smoothrivers.js"
}

function applyWaterLayer(x,y){ // function to actually apply the water layers to the terrain
  decimal = dimension.getHeightAt(x,y) % 1; // getting the remainder of the height
  print(decimal);
  if (decimal <= 0.125 && decimal > 0.0){
    print("Applied layer 1");
    dimension.setBitLayerValueAt(waterLayer1, x, y, 100);
  } else if (decimal <= 0.25 && decimal > 0.0) {
    print("Applied layer 2");
    dimension.setBitLayerValueAt(waterLayer2, x, y, 100);
  } else if (decimal <= 0.375 && decimal > 0.0) {
    print("Applied layer 3");
    dimension.setBitLayerValueAt(waterLayer3, x, y, 100);
  } else if (decimal <= 0.5 && decimal > 0.0) {
    print("Applied layer 4");
    dimension.setBitLayerValueAt(waterLayer4, x, y, 100);
  } else if (decimal <= 0.625 && decimal > 0.0) {
    print("Applied layer 5");
    dimension.setBitLayerValueAt(waterLayer5, x, y, 100);
  } else if (decimal <= 0.75 && decimal > 0.0) {
    print("Applied layer 6");
    dimension.setBitLayerValueAt(waterLayer6, x, y, 100);
  } else if (decimal <= 0.875 && decimal > 0.0) {
    print("Applied layer 7");
    dimension.setBitLayerValueAt(waterLayer7, x, y, 100);
  } else if (decimal <= 1) {
    print("Applied layer 0");
    dimension.setBitLayerValueAt(waterLayer0, x, y, 100);
  }
}

var rect = dimension.getExtent();

if (arguments[0] === ""){ // user did not specify water layer mask to apply to; default to terrain type water
  for (var x = rect.getX() * 128; x < rect.getWidth() * 128; x++)
  {
    for (var y = rect.getY() * 128; y < rect.getHeight() * 128; y++)
    {
      if (dimension.getTerrainAt(x,y).getName() === "Water"){ //
        applyWaterLayer(x,y);
      }
    }
  }
} 
else { // user specified a mask for the water layers to be applied to
  try {
    var mask = wp.getLayer().fromWorld(world).withName(arguments[0]).go();//load the layer as mask-layer.
    print("Selected layer mask: " + mask);
  } catch(err) {
    print("Could not find the specified layer file. Make sure it's already imported into the current world.");
  }
  for (var x = rect.getX() * 128; x < rect.getWidth() * 128; x++)
  {
    for (var y = rect.getY() * 128; y < rect.getHeight() * 128; y++)
    {
      if (dimension.getBitLayerValueAt(mask, x, y) > 0){ // check for whether the mask layer is applied at the coords (if it is, then the water layers are added)
        applyWaterLayer(x,y);
      }
    }
  }
}

print("Finshed :D");
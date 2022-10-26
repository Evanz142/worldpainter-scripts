var rect = dimension.getExtent();

if (arguments[0] === ""){ // user did not specify a layer to use the script on
  print("Please specify a layer to use the script on.")
} 
else { // user specified a mask for the water layers to be applied to
  try {
    var mask = wp.getLayer().fromWorld(world).withName(arguments[0]).go();//load the layer as mask-layer.

    print("Selected layer: " + mask);

    var otherWater;

    try {
       otherWater = wp.getLayer().fromWorld(world).withName(arguments[1]).go();//load the layer as mask-layer.
       print("Selected extra water layer: " + otherWater);
    } catch (err) {
      print("No extra water layer loaded");
    }



  } catch(err) {
    print("Could not find the specified layer file. Make sure it's already imported into the current world.");
  }
  for (var x = rect.getX() * 128; x < rect.getWidth() * 128; x++)
  {
    for (var y = rect.getY() * 128; y < rect.getHeight() * 128; y++)
    {
      if (dimension.getBitLayerValueAt(mask, x, y) > 0){ // check for whether the mask layer is applied at the coords
        var terrainValue = dimension.getTerrainAt(x,y).getName().toLowerCase();

        if (!(dimension.getHeightAt(x-1,y)<40.5 || dimension.getHeightAt(x,y-1)<40.5 || dimension.getHeightAt(x+1,y)<40.5 || dimension.getHeightAt(x,y+1)<40.5)) {
          /*print(dimension.getHeightAt(x,y));*/
          if (otherWater) {
            if (!(dimension.getBitLayerValueAt(otherWater,x-1,y)>0 || dimension.getBitLayerValueAt(otherWater,x,y-1)>0 || dimension.getBitLayerValueAt(otherWater,x+1,y)>0 || dimension.getBitLayerValueAt(otherWater,x,y+1)>0)) {
              dimension.setBitLayerValueAt(mask, x, y, 0);
            }
          }
          else {
            dimension.setBitLayerValueAt(mask, x, y, 0);
          }
        }
      }
    }
  }
}

print("Finshed :D");
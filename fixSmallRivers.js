var rect = dimension.getExtent();

var annotLayer = wp.getLayer().withName('Annotations').go();
var annotColors = ["white", "orange", "magenta", "light_blue", "yellow", "lime", "pink", "light_grey", "cyan", "purple", "blue", "brown", "green", "red", "black"];
var customWater;
var colorLocation = null;
var defaultWater = true;
var blocksFixed = 0;

if (arguments[0] === "") {
    throw "Make sure you supply a value for which water type should be used! Write 'default' as the first parameter if you want default water or write a custom layer name if you want to apply the script on custom water.";
} else if (arguments[0] === "default") {
    print("Default water selected.");
} else {
    defaultWater = false;
    try {
        customWater = wp.getLayer().fromWorld(world).withName(arguments[0]).go();
        print("'" + arguments[0] + "' selected as custom water.");
    } catch(err) {
        throw "Make sure " + arguments[0] + " exists in the current world.";
    }
}

if (arguments.length == 1) {
    print("No annotation mask applied.");
} else {

    if (annotColors.indexOf(arguments[1].toLowerCase()) != -1) {
        colorLocation = annotColors.indexOf(arguments[1]);
        print("'" + annotColors[colorLocation] + "' selected as the annotation mask.");
    } else {
        throw "Please provide a proper annotation name. You can use the any of the following: [white, orange, magenta, light_blue, yellow, lime, pink, light_grey, cyan, purple, blue, brown, green, red, black]."
    }
}

function setFixedWater(x, y, arguments) {
    
    if (arguments.length == 1) { // if (annotation mask is not provided)
        blocksFixed++; // increments the total blocks fixed (just to show the user)
        if (arguments[0] === "default") { // check if the user wants to apply script to default water
            dimension.setTerrainAt(x, y, org.pepsoft.worldpainter.Terrain.WATER);
        } else { // else assume they are applying to custom water
            dimension.setBitLayerValueAt(customWater, x, y, 100);
        }
    } else if (dimension.getLayerValueAt(annotLayer, x, y) - 1 == colorLocation) { // 1 is subtracted from the layer value because annotations start from 1 instead of zero (and I set the color location to start from zero)
        blocksFixed++;
        if (arguments[0] === "default") {
            dimension.setTerrainAt(x, y, org.pepsoft.worldpainter.Terrain.WATER);
        } else {
            dimension.setBitLayerValueAt(customWater, x, y, 100);
        }
    } else {
        //print("Water is not annotated according to the mask.")
    }
}

function checkIfWater(x, y, defaultWater) { // Function to check if there is water at coords (x, y)

    // World painter has different methods for checking if the terrain is water vs if there is a custom water layer on the terrain.
    if (defaultWater) {  // check for the 'water' terrain (default water)
        try { // for some reason sometimes getTerrainAt returns null (world painter moment)
            return dimension.getTerrainAt(x, y).getName() === "Water";
        } catch (error) {
            return false;
        }
    } else { // check for the custom water layer 
        return dimension.getBitLayerValueAt(customWater, x, y) > 0;
    }
}

for (var x = rect.getX() * 128; x < rect.getWidth() * 128; x++) {
    for (var y = rect.getY() * 128; y < rect.getHeight() * 128; y++) {
        if (checkIfWater(x, y, defaultWater)) { 
            //print("Found water!");

            // Check whether the blocks diagonal to water are also water, then checks if the only connection is diagonal.
            if (checkIfWater(x - 1, y - 1, defaultWater)) {
                if (!(checkIfWater(x, y - 1, defaultWater)) && !(checkIfWater(x - 1, y, defaultWater))) {
                    //print("The waters only attachment is diagonal - now fixing");
                    setFixedWater(x, y - 1, arguments);
                }
            }

            if (checkIfWater(x + 1, y - 1, defaultWater)) {
                if (!(checkIfWater(x, y - 1, defaultWater)) && !(checkIfWater(x + 1, y, defaultWater))) {
                    //print("The waters only attachment is diagonal - now fixing");
                    setFixedWater(x, y - 1, arguments);
                }
            }

            if (checkIfWater(x - 1, y + 1, defaultWater)) {
                if (!(checkIfWater(x, y + 1, defaultWater)) && !(checkIfWater(x - 1, y, defaultWater))) {
                    //print("The waters only attachment is diagonal - now fixing");
                    setFixedWater(x, y + 1, arguments);
                }
            }

            if (checkIfWater(x + 1, y + 1, defaultWater)) {
                if (!(checkIfWater(x, y + 1, defaultWater)) && !(checkIfWater(x + 1, y, defaultWater))) {
                    //print("The waters only attachment is diagonal - now fixing");
                    setFixedWater(x, y + 1, arguments);
                }
            }

        }
    }
}

print(blocksFixed + " blocks have been fixed.")
print("Done! - Script by Evmanz");
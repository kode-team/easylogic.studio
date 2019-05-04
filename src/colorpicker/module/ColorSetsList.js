import Color from '../../util/Color'
import { isFunction, isUndefined, isNumber } from '../../util/functions/func';
import { ACTION, GETTER } from '../../util/Store';
import BaseModule from '../../util/BaseModule';

export default class ColorSetsList extends BaseModule {
    initialize () {
        super.initialize();

        // set property
        this.$store.colorSetsList = [
            {   name : "Material", 
                edit: true,
                colors: [ 
                    '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', 
                    '#2196F3', '#03A9F4', '#00BCD4',  '#009688', '#4CAF50', 
                    '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', 
                    '#FF5722',  '#795548', '#9E9E9E', '#607D8B' 
                ]
            },
            { name : "Custom", "edit" : true, "colors" : [ ] },
            { name: "Color Scale", "scale" : ['red', 'yellow', 'black' ], count : 5 }
        ]
        this.$store.currentColorSets = {}        
    }


    [ACTION('setUserPalette')] ($store, list) {
        $store.userList = list; 

        $store.dispatch('resetUserPalette');
        $store.dispatch('setCurrentColorSets');
    }

    [ACTION('resetUserPalette')] ($store) {
        if ($store.userList && $store.userList.length) {
            $store.userList = $store.userList.map( (element, index) => {

                if (isFunction( element.colors )) {
                    const makeCallback = element.colors; 

                    element.colors = makeCallback($store);
                    element._colors = makeCallback;
                }

                return { 
                    name: `color-${index}`,
                    colors : [],
                    ...element
                }
            })

            $store.emit('changeUserList');
        }
    }

    [ACTION('setCurrentColorSets')] ($store, nameOrIndex) {

        const _list = $store.read('list');

        if (isUndefined(nameOrIndex)) {
            $store.currentColorSets = _list[0];
        } else if (isNumber(nameOrIndex)) {
            $store.currentColorSets = _list[nameOrIndex];
        } else {
            $store.currentColorSets = _list.filter(function (obj) {
                return obj.name == nameOrIndex;
            })[0];
        }
    
        $store.emit('changeCurrentColorSets');
    }

    [GETTER('getCurrentColorSets')] ($store) {
        return $store.currentColorSets;
    }

    [ACTION('addCurrentColor')] ($store, color) {
        if (Array.isArray($store.currentColorSets.colors)) {
            $store.currentColorSets.colors.push(color);
            $store.emit('changeCurrentColorSets');
        } 
    }

    [ACTION('setCurrentColorAll')] ($store, colors = []) {
        $store.currentColorSets.colors = colors;
        $store.emit('changeCurrentColorSets');
    }

    [ACTION('removeCurrentColor')] ($store, index) {
        if ($store.currentColorSets.colors[index]) {
            $store.currentColorSets.colors.splice(index, 1);
            $store.emit('changeCurrentColorSets');
        }
    }

    [ACTION('removeCurrentColorToTheRight')] ($store, index) {
        if ($store.currentColorSets.colors[index]) {
            $store.currentColorSets.colors.splice(index, Number.MAX_VALUE);
            $store.emit('changeCurrentColorSets');
        }
    }    

    [ACTION('clearPalette')] ($store) {
        if ($store.currentColorSets.colors) {
            $store.currentColorSets.colors = [];
            $store.emit('changeCurrentColorSets');
        }
    }


    [GETTER('list')] ($store) {
        return Array.isArray($store.userList) && $store.userList.length ? $store.userList : $store.colorSetsList;
    }    

    [GETTER('getCurrentColors')] ($store ) {
        return $store.read('getColors', $store.currentColorSets);
    }

    [GETTER('getColors')] ($store, element) {
        if (element.scale) {
            return Color.scale(element.scale, element.count);
        }
        
        return element.colors || []; 
    }

    [GETTER('getColorSetsList')] ($store) {
        return $store.read('list').map(element => {
           return {
               name : element.name,
               edit : element.edit,
               colors : $store.read('getColors', element)
           } 
        });
    }
  
}
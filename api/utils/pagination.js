module.exports = {
    getNextId: function(items, index){
        if(items.length > index)
        {
            items = items[index+1];
            if(items)
            {
                var next_id = items[0]._id.toString();
                return items[0]._id.toString();
            }
            return "";
        }
    },
    getItemChunkIndex: function(items, item_id){
        boolean: isIndex = false;
        Number: index = 0;
        Number: item_index = 0;
        if(item_id == 0)
            return item_index;
    
        for(index = 0; index < items.length; index++){
            items[index].forEach(function (value, i){
                if(value._id.toString() == item_id)
                    isIndex = true;
            });
            if(isIndex){
                item_index =  index;
                index = items.length;
            }
        }
        return item_index;
    },
    chunkArray: function(items, limit){
        var index = 0;
        var itemLength = items.length;
        var tempItemArr = [];

        for(index = 0; index < itemLength; index += limit){
            var chunkItemArr = items.slice(index, index + limit);
            tempItemArr.push(chunkItemArr);
        }

        return tempItemArr;
    },
    getItemType: function(cat){
        switch(cat){
        case 'Store':
            return "store-v1";
        case 'Restaurant':
            return "restaurant-v1";
        case 'Activity':
            return "activity-v1";
        default:
            return "";
    }
    }
};
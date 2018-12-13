module.exports = {
    distinct: (array) => {

        let flag = 0;
        let result = [];

        for(let i = 0; i< array.length; i++){

            if(flag > array[i].dataValues.no){
                throw new Error('its should be sorted by pk!')
            }else{
                if(flag !== array[i].dataValues.no){
                    flag = array[i].dataValues.no;
                    result.push(array[i]);
                }
            }
        }

        return result;
    }
}
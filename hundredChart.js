window.onload = function(){
    /* SAMPLE OF A ACTION OBJECT
{
    action: "selectNumber",
    value: [12]
}
{
    action: "selectedRow",
    value: [1,2,3,4..]
}
*/

class HundredChart{

    constructor(){
        this.hundredChart = [];
        
        for(let i=0; i<10; i++){
            const row = {
                selected: false,
                cells : []
            };
           for(let j=0; j<10; j++){
                let cell = {
                    num: ( j + (10*i) + 1 ),
                    selected: false
                };
                row.cells.push(cell);
           } 
           this.hundredChart.push(row);
        }

        this.actionStack = [];

    }

    selectRow(rowIndex){

        const action = {value: [], actionMethod: "selectRow"};

        let row = this.hundredChart[rowIndex];
        let doSelect = !row.selected;
        
        row.cells.forEach((cell) => {

            // If the current state of the cell is not equal to the intention (select or deselect row)
            // This means there will be a change in state, so we need to record this in the action stack.
            if(doSelect !== cell.selected){
                cell.selected = doSelect;
                action.value.push(cell.num);
            }

        });

        row.selected = doSelect;

        this.actionStack.push(action);

    }

    selectNumber(num, fromUndo){

        let rowIndex = Math.floor((num - 1)  / 10);
        let colIndex = (num - 1) % 10;
        
        let row = this.hundredChart[rowIndex];
        let cell = row.cells[colIndex];

        
        cell.selected = !cell.selected;
        // Marks the row to be selected only if all cells in row are selected.
        row.selected = row.cells.every((cell) => cell.selected);

        // Create an action and add to stack if not coming from undo method.
        if(!fromUndo){
            const action = {value: [], toSelect: cell.selected};
            action.value.push(cell.num);   
            this.actionStack.push(action);
        }

    }

    undoAction(){

        const lastAction = this.actionStack.pop();
        
        lastAction.value.forEach((num) => {
            // Do the opposite of the action.
            this.selectNumber(num, true);
        });

    }

    render(){

        this.hundredChart.forEach((row) => {

            let line = row.selected.toString() + " : " + row.cells.reduce((acc, cell) => {

                let separatorPart = cell.selected? " < " : " | ";
                let numPart = cell.num.toString();
                
                return (acc + numPart + separatorPart);

            }, "");

            console.log(line);

        });

    }

}

const myChart = new HundredChart();
window.myChart = myChart;

console.log(myChart);

const chart = getById('chart');
let chartChildren = [...chart.children];
    
    
    console.log('Collection of rows', chartChildren);
    
chartChildren.forEach((row, rowIndex) => {
    let rowChildren = [...row.children];
    
    console.log('This is the row children', rowChildren);
    rowChildren.forEach((cell, cellIndex) => {
        
        if(cellIndex === 0){
            cell.children[0].innerHTML = "Select";
        }else{
            cell.children[0].innerHTML = (rowIndex * 10 + cellIndex);
        }
        
    });
    
});
    
    
function getById(eleId){
    return document.getElementById(eleId);
}

}
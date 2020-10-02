import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './Maze.css';
import Cell from '../Cell/Cell'
import PriorityQueue from '../PriorityQueue';
import DataCell from '../DataCell';

//global variables
const numColumns = 50;
const numRows = 30;
const mazeSize = numRows*numColumns;
const clWaitTime = 25;
const ppWaitTime = 50;
const travWaitTime = 100;
const finalWaitTime = 75;
var blockedMemory = Array(mazeSize).fill(false);


export default class Maze extends Component{ 
    constructor(props) {
        super(props);
        this.state = {
            //initial layout of cells in maze
            cells: Array(mazeSize).fill("c"),
            previousMaze: Array(mazeSize).fill("c"),
            previousStart: null,
            previousGoal: null,
            //track buttons for placing maze items
            action: "c",
            //tracks if mouse is down for smoother UX
            mouseIsDown: false,
            startLocation: null,
            goalLocation: null,

            inProgress: false,
            showExtraAnimations: false,
            updateNeeded: false,
        };
    }

    
    //adjusts selected cell based on last button pressed
    async handleMouseDown(i){
        if(this.state.inProgress)
            return;
        if(this.state.updateNeeded){
            await this.handleResetClick();
        }
        this.setState({mouseIsDown: true});
        var cells = this.state.cells.slice();
        

        //reset start/goal location if overwritten

        if(this.state.cells[i] === "s"){
            this.setState({startLocation: null});
        }
        else if(this.state.cells[i] === "g"){
            this.setState({goalLocation: null});
        }
         
        //allow only one start/goal
        if(this.state.action === "s"){
            if(this.state.startLocation !== null){
                cells[this.state.startLocation] = "c";
            }
            this.setState({startLocation: i});
            cells[i] = "s";           
        }
        else if(this.state.action === "g"){
            if(this.state.goalLocation !== null){
                cells[this.state.goalLocation] = "c";
            }
            this.setState({goalLocation: i});
            cells[i] = "g";
        }
        

        //create duplicate maze to maintain immutability
        cells[i] = this.state.action;
        
        this.setState({cells: cells});

    }

    //adjusts selected cell based on last button pressed
    handleMouseEnter(i){
        if(this.state.mouseIsDown){
            this.handleMouseDown(i);
        }
    }

    //adjusts selected cell based on last button pressed
    handleMouseUp(i){
        this.setState({mouseIsDown: false});
    }

    //adjusts the action variable based on the last button pressed
    handleButtonClick(buttonClicked){
        
        let oldButton = this.state.action;

        if(buttonClicked !== this.state.action){
            this.setState({
                action: buttonClicked,
            });

            var temp;

            //unhighlight old button
            switch(oldButton){
                case "s":
                    temp = document.getElementsByClassName("start-button");
                    break;
                case "g":
                    temp = document.getElementsByClassName("goal-button");
                    break;
                case "w":
                    temp = document.getElementsByClassName("wall-button");
                    break;
                case "c":
                    temp = document.getElementsByClassName("clear-button");
                    break;

                default:
                    break;
            }

            
            temp[0].style.background = null;
            temp[0].style.color=null;

            //highlight new button
            switch(buttonClicked){
                case "s":
                    temp = document.getElementsByClassName("start-button");

                    break;
                case "g":
                    temp = document.getElementsByClassName("goal-button");

                    break;
                case "w":
                    temp = document.getElementsByClassName("wall-button");

                    break;
                case "c":
                    temp = document.getElementsByClassName("clear-button");

                    break;

                default:
                    break;
            }
            
            temp[0].style.background = '#007bff';
            temp[0].style.color = "white";

        }


    }

    //create a random maze layout
    handleRandomizeClick(){  
        if(this.state.inProgress)
            return;
        const cells = this.state.cells.slice();
        //pick a random starting point
        let s = Math.floor(Math.random() * mazeSize);

        //pick a random goal that is not the same as the start point
        let r = s;
        while(r === s){
            r = Math.floor(Math.random() * mazeSize)
        }

        //give every non start/goal cell a 30% chance to be marked as a wall
        for(let i=0; i<mazeSize; i++){
            let q = Math.floor(Math.random() * 101);
            if(q <= 30){
                cells[i] = "w";
            }
            else{
                cells[i] = "c";
            }    
        }
        cells[s] = "s";
        cells[r] = "g"; 
        this.setState({cells: cells,
                        startLocation: s,
                        goalLocation: r,
                        updateNeeded: false});

    }

    //clear the maze to be all empty cells
    handleClearClick(){
        if(this.state.inProgress){
            return;
        }
        this.setState({cells: Array(mazeSize).fill("c"),
                        startLocation: null,
                        goalLocation: null,
                        updateNeeded: false});
    }

    //toggle whether extra animations are shown when running the algorithm
    handleAnimationsClick(){
        if(this.state.inProgress){
            return;
        }
        this.setState({showExtraAnimations: !this.state.showExtraAnimations});

        var temp = document.getElementsByClassName("ToggleAnimations");

        if(!this.state.showExtraAnimations){
            
            temp[0].style.background = '#007bff';
            temp[0].style.color = "white";
        }
        else{
            temp[0].style.background=null;
            temp[0].style.color = null;
        }

    }

    //shows logs for debugging
    handleDebugClick(){
        console.log("debug pressed");
        console.log("current action is " + this.state.action);
        console.log("current state is " + this.state.cells);
        console.log("start location is " + this.state.startLocation);
        console.log("goal location is " + this.state.goalLocation);
        console.log("mouse pressed is " + this.state.mouseIsDown);
        console.log("updateNeeded: " + this.state.updateNeeded);
        

        //display blocked memory
        /*
        for(let i=0; i<mazeSize; i++){
            console.log("blocked " + i + ": " + blockedMemory[i]);
        }
        */
    }

    //debugging fuction for printing current values in cells
    debugMaze(dataCells){
        for(let i=0; i<mazeSize; i++){
            console.log("index: " + i);
            console.log("position: " + dataCells[i].position);
            console.log("status: " + dataCells[i].status);
            console.log("gVal: " + dataCells[i].gVal);
            console.log("fVal: " + dataCells[i].fVal);
            console.log("hVal: " + dataCells[i].hVal);
            console.log("searchVal: " + dataCells[i].searchValue);
            console.log("treePointer: " + dataCells[i].treePointer);
        }
    }

    //additional debug information
    debugProjectedPath(dataCells, currentCell, alg){
        var pointer = dataCells[this.state.goalLocation];
        var upTo = currentCell;
        var path = [];
        var pt = 0;

        if(alg === "f"){
            console.log("Projected Path: ");
            console.log("{" + currentCell.status + "," + currentCell.position + "} ");
            path[pt] = currentCell;
            pt++;

            while(upTo !== dataCells[this.state.goalLocation]){
                while(pointer.treePointer !== upTo){
                    pointer = pointer.treePointer;
                }
                console.log("{" + pointer.status + "," + pointer.position + "} ");
                path[pt] = pointer;
                pt++;

                upTo = pointer;
                pointer = dataCells[this.state.goalLocation];
            }
        }

    }
    
    //alg parameter adjusts setup based on "f", "b", or "a" for forward, backward, and adaptive a*, respectively
    //a cells (x,y) location in maze based on id is (id%numColumns, id/numColumns)
    establishMaze(alg, dataCells){
        //reset the agent's memory of the maze before re-running the algorithm  
        blockedMemory.fill(false);
        
        //fill array of dataCells based on Cell status
        for(let i=0; i<mazeSize; i++){
            dataCells[i] = new DataCell(this.state.cells[i]);
            dataCells[i].position = i;
        }
        
        //fill dataCells with f,g,h,search values
        for(let i=0; i<mazeSize; i++){
            dataCells[i].gVal = Number.MAX_SAFE_INTEGER;
            dataCells[i].fVal = Number.MAX_SAFE_INTEGER;
            if(alg === "f"){
                dataCells[i].hVal = Math.abs(i%numColumns - this.state.goalLocation%numColumns) + Math.abs(Math.floor(i/numColumns) - Math.floor(this.state.goalLocation/numColumns));
            }
            //this.debugMaze(dataCells);
        }
    }

    //looks at cells adjacent to the current cell, sets any that are walls to true in blockedMemory 
    checkNeighbors(dataCells, currentCell){

        var below = currentCell.position + numColumns;
        var right = currentCell.position + 1;
        var above = currentCell.position - numColumns;
        var left = currentCell.position - 1;
        //check below
        //console.log("current position: " + currentCell.position);
        //console.log("below: " + below);
        //console.log("right: " + right);
        //console.log("above: " + above);
        //console.log("left: " + left);
        
        //console.log("in check neighbors");
        if(below < mazeSize){
            //console.log("1");
            if(dataCells[below].status === "w" || dataCells[below].status === "clw" || dataCells[below].status === "ppw" || dataCells[below].status === "ws"){
                //console.log("2");

                blockedMemory[below] = true;
            }
        }
        //check right
        if(Math.floor(currentCell.position/numColumns) === Math.floor(right/numColumns)){
            //console.log("3");
            if(dataCells[right].status === "w" || dataCells[right].status === "clw" || dataCells[right].status === "ppw" || dataCells[right].status === "ws"){
                //console.log("4");
                blockedMemory[right] = true;
            }
        }
        //check above
        if(above >= 0){
            //console.log("5");
            if(dataCells[above].status === "w" || dataCells[above].status === "clw" || dataCells[above].status === "ppw" || dataCells[above].status === "ws"){
                //console.log("6");
                blockedMemory[above] = true;
            }
        }
        //check left
        if(Math.floor(currentCell.position/numColumns) === Math.floor(left/numColumns)){
            //console.log("7");
            if(dataCells[left].status === "w" || dataCells[left].status === "clw" || dataCells[left].status === "ppw" || dataCells[left].status === "ws"){
                //console.log("8");
                blockedMemory[left] = true;
            }
        }
    }

    //computes the projected path of a single iteration of any A* algorithm
    computePath(oList, cList, dataCells, counter){
        //track visited cells in order (for animation)
        var visitedCells = [];
        //var counter = 0;

        //determine starting position
        var currentCell = oList.dequeue().element;

        //console.log("starting compute path on " + currentCell.position);
        //while g value of goal is greater than g value of current cell
        while(dataCells[this.state.goalLocation].gVal > currentCell.gVal){
            //add current position to closed list
            cList.enqueue(currentCell, currentCell.fVal);
            //console.log(currentCell.position + " added to closed list");
            //cList.printList();
            
            //track visited cells
            visitedCells.push(currentCell);
            //counter++;
            //console.log(currentCell.position + " set to cl");
            //this.handleDebugClick();


            //for every non wall neighbor of currentCell
            var below = currentCell.position + numColumns;
            var right = currentCell.position + 1;
            var above = currentCell.position - numColumns;
            var left = currentCell.position - 1;

            //if bottom neighbor is inbounds
            if(below < mazeSize){
                //if neighbor is not blocked, not start, and has a search value less than counter
                if(!blockedMemory[below] && !cList.contains(dataCells[below]) && !oList.contains(dataCells[below])){
                    if(dataCells[below].searchValue < counter){
                        //set g and search value
                        dataCells[below].gVal = Number.MAX_SAFE_INTEGER;
                        dataCells[below].searchValue = counter;
                    }
                    if(dataCells[below].gVal > currentCell.gVal + 1){
                        dataCells[below].gVal = currentCell.gVal + 1;
                    }
                    dataCells[below].treePointer = currentCell;
                    //if cell below is in oList, remove
                    if(oList.front().element === dataCells[below]){
                        oList.dequeue();
                    }
                    //update f value, add below cell to open list
                    dataCells[below].fVal = dataCells[below].gVal + dataCells[below].hVal;
                    oList.enqueue(dataCells[below], dataCells[below].fVal);

                    //look at this line in eclipse project if issues, not using a temp Cell to do things
                    //console.log("(below) {" + dataCells[below].position + "} added to olist");
                }
            }
            //if right neighbor is inbounds
            if(Math.floor(currentCell.position/numColumns) === Math.floor(right/numColumns)){
                //if neighbor is not blocked, not start, and has a search value less than counter
                if(!blockedMemory[right] && !cList.contains(dataCells[right]) && !oList.contains(dataCells[right])){
                    if(dataCells[right].searchValue < counter){
                        //set g and search value
                        dataCells[right].gVal = Number.MAX_SAFE_INTEGER;
                        dataCells[right].searchValue = counter;
                    }
                    if(dataCells[right].gVal > currentCell.gVal + 1){
                        dataCells[right].gVal = currentCell.gVal + 1;
                    }
                    dataCells[right].treePointer = currentCell;
                    //if cell right is in oList, remove
                    if(oList.front().element === dataCells[right]){
                        oList.dequeue();
                    }
                    dataCells[right].fVal = dataCells[right].gVal + dataCells[right].hVal;
                    //update f value, add right cell to open list
                    oList.enqueue(dataCells[right], dataCells[right].fVal);

                    //look at this line in eclipse project if issues, not using a temp Cell to do things
                    //console.log("(right) {" + dataCells[right].position + "} added to olist");
                }
            }
            //if above neighbor is inbounds
            if(above >= 0){
                //if neighbor is not blocked, not start, and has a search value less than counter
                if(!blockedMemory[above] && !cList.contains(dataCells[above]) && !oList.contains(dataCells[above])){
                    if(dataCells[above].searchValue < counter){
                        //set g and search value
                        dataCells[above].gVal = Number.MAX_SAFE_INTEGER;
                        dataCells[above].searchValue = counter;
                    }
                    if(dataCells[above].gVal > currentCell.gVal + 1){
                        dataCells[above].gVal = currentCell.gVal + 1;
                    }
                    dataCells[above].treePointer = currentCell;
                    //if cell above is in oList, remove
                    if(oList.front().element === dataCells[above]){
                        oList.dequeue();
                    }
                    dataCells[above].fVal = dataCells[above].gVal + dataCells[above].hVal;
                    //update f value, add above cell to open list
                    oList.enqueue(dataCells[above], dataCells[above].fVal);

                    //look at this line in eclipse project if issues, not using a temp Cell to do things
                    //console.log("(above) {" + dataCells[above].position + "} added to olist");
                }
            }
            //if left neighbor is inbounds
            if(Math.floor(currentCell.position/numColumns) === Math.floor(left/numColumns)){
                //if neighbor is not blocked, not start, and has a search value less than counter
                if(!blockedMemory[left] && !cList.contains(dataCells[left]) && !oList.contains(dataCells[left])){
                    if(dataCells[left].searchValue < counter){
                        //set g and search value
                        dataCells[left].gVal = Number.MAX_SAFE_INTEGER;
                        dataCells[left].searchValue = counter;
                    }
                    if(dataCells[left].gVal > currentCell.gVal + 1){
                        dataCells[left].gVal = currentCell.gVal + 1;
                    }
                    dataCells[left].treePointer = currentCell;
                    //if cell left is in oList, remove
                    if(oList.front().element === dataCells[left]){
                        oList.dequeue();
                    }
                    dataCells[left].fVal = dataCells[left].gVal + dataCells[left].hVal;
                    //update f value, add left cell to open list
                    oList.enqueue(dataCells[left], dataCells[left].fVal);

                    //look at this line in eclipse project if issues, not using a temp Cell to do things
                    //console.log("(left) {" + dataCells[left].position + "} added to olist");
                }
            }

            //move on to next cell in queue
            //oList.printList();
            currentCell = oList.dequeue().element;
            //console.log("last dequeue'd element: " + currentCell.position);
            //console.log("goal at end: " + dataCells[this.state.goalLocation].position);
            //when out of cells, return
            if(currentCell === undefined){
                return visitedCells;
            }

        }
        //console.log("shoulde probably be returning closed list here too");
        //might not do anything...
        oList.enqueue(currentCell, currentCell.fVal);

        return visitedCells;

    }

    //animates the closed list while running the algorithm
    async animateClosedList(visitedCells){
        const totalTime = (visitedCells.length * clWaitTime) + clWaitTime
        return new Promise(resolve =>{
            for(let i=0; i<visitedCells.length; i++){
                setTimeout(()=> {
                    const currentCell = visitedCells[i];
                    //a***************************************
                    const cells = this.state.cells.slice();
                    //console.log("STATUS IS " + currentCell.status);
                    if(currentCell.status === "c"){
                        cells[currentCell.position] = "cl";
                        //this.state.cells[currentCell.position] = "cl";
                        currentCell.status = "cl"
                    }
                    else if(currentCell.status ==="w" || currentCell.status === "ws"){
                        cells[currentCell.position] = "clw"
                        //this.state.cells[currentCell.position] = "clw";
                        currentCell.status = "clw";
                    }
                    this.setState({cells: cells});
                    //a***************************************
                    //console.log("hi :)");
                }, clWaitTime * i);
            }
            setTimeout(()=>{
                resolve();
                }, totalTime);
        });
    }

    //animates the projected path of the agent
    async animateProjectedPath(path){
            const totalTime = (path.length * ppWaitTime) + ppWaitTime;
            //console.log("total pp time = " + totalTime);
            return new Promise(resolve =>{
                for(let i=0; i<path.length; i++){
                    setTimeout(()=>{
                        //add cases for cl, clw, g, a
                        const cells = this.state.cells.slice();
                        if(path[i].status === "c" || path[i].status === "cl"){
                            cells[path[i].position] = "pp";
                            //this.state.cells[path[i].position] = "pp";
                            path[i].status = "pp";
                        }
                        else if(path[i].status === "w" || path[i].status === "ws" || path[i].status === "clw"){
                            cells[path[i].position] = "ppw";
                            //this.state.cells[path[i].position] = "ppw";
                            path[i].status = "ppw";
                        }
                        this.setState({cells: cells});
                    }, ppWaitTime * i);
                }
                setTimeout(() => {
                    resolve();
                    }, totalTime);
            });        
    }

    //displays the projected path of the agent all at once
    showProjectedPath(path){
        const cells = this.state.cells.slice();
        for(let i=0; i<path.length; i++){
            if(path[i].status === "c" || path[i].status === "cl"){
                cells[path[i].position] = "pp";
                //this.state.cells[path[i].position] = "pp";
                path[i].status = "pp";
            }
            else if(path[i].status === "w" || path[i].status === "ws" || path[i].status === "clw"){
                cells[path[i].position] = "ppw";
                //this.state.cells[path[i].position] = "ppw";
                path[i].status = "ppw";
            }
        }
        this.setState({cells: cells});
    }

    //animate the agent traveling along it's projected path
    async animateTraversal(path){
        const totalTime = (path.length * travWaitTime) + travWaitTime;
        //console.log("total t time = " + totalTime);
        return new Promise(resolve =>{
            for(let i=0; i<path.length; i++){
                setTimeout(()=>{
                    const cells = this.state.cells.slice();
                    if(path[i].status !== "g"){
                        cells[path[i].position] = "t";
                        //this.state.cells[path[i].position] = "t";
                        path[i].status = "t";
                    }
                    if(i>0){
                        if(path[i-1].position === this.state.startLocation){
                            cells[path[i-1].position] = "s";
                            //this.state.cells[path[i-1].position] = "s";
                            path[i-1].status = "s";
                        }
                        else{
                            cells[path[i-1].position] = "pp";
                            //this.state.cells[path[i-1].position] = "pp";
                            path[i-1].status = "pp";
                        }
                    } 
                    //console.log("status is: " + path[i].status)

                    this.setState({cells: cells});
                }, travWaitTime * i);
            }
            setTimeout(() => {
                resolve();
                }, totalTime);
        });

    }

    //animate the full path taken by the agent
    async animateFinalPath(path){
        const totalTime = (path.length * finalWaitTime) + finalWaitTime;
        //console.log("total fp time = " + totalTime);
        return new Promise(resolve =>{
            for(let i=0; i<path.length; i++){
                setTimeout(()=>{
                    //add cases for cl, clw, g, a
                    const cells = this.state.cells.slice();
                    
                    cells[path[i].position] = "t";

                    //this.state.cells[path[i].position] = "fp";
                    path[i].status = "fp";
                    if(i>0){
                        if(path[i-1].position === this.state.startLocation){
                            cells[path[i-1].position] = "s";
                            //this.state.cells[path[i-1].position] = "s";
                            path[i-1].status = "s";
                        }
                        else{
                            cells[path[i-1].position] = "fp";
                            path[i-1].status = "fp";
                        }
                    }
                    if(i === path.length-1){
                        cells[path[i].position] = "tg";
                        //this.state.cells[path[i].position] = "tg";
                        path[i].status = "tg";
                    }   
                    this.setState({cells: cells});
                }, finalWaitTime * i);
            }
            setTimeout(() => {
                resolve();
                }, totalTime);
        });


    }

    //update wall values based on if the agent has seen them or not
    updateWalls(dataCells){
        const cells = this.state.cells.slice();
        for(let i=0; i<mazeSize; i++){
            //console.log("NEWEST DEBUG");
            //console.log("dataCells[i].status is: " + dataCells[i].status);
            if(blockedMemory[i] === true){
                cells[i] = "ws";
                dataCells[i].status = "ws";
                //this.state.cells[i] = "ws";
            }
            else if(this.state.cells[i] === "w" || this.state.cells[i] === "ws"){
                cells[i] = "w";
                dataCells[i].status = "w";
                //this.state.cells[i] = "w";
            }
        }
        this.setState({cells: cells});
    }

    //reset traversed cells, seen walls, and other special cell colors to their original states prior to running the algorithm
    resetBoardStates(dataCells, clCells){
        var currentCell;
        const cells = this.state.cells.slice();
        for(let i=0; i<clCells.length; i++){
            currentCell = clCells[i];
            switch(dataCells[currentCell.position].status){
                case "pp":
                    cells[currentCell.position] = "c";
                    //this.state.cells[currentCell.position] = "c";
                    dataCells[currentCell.position].status = "c";
                    break;
                case "ppw":
                    cells[currentCell.position] = "w";
                    //this.state.cells[currentCell.position] = "w";
                    dataCells[currentCell.position].status = "w";
                    break;
                case "cl":
                    cells[currentCell.position] = "c";
                    //this.state.cells[currentCell.position] = "c";
                    dataCells[currentCell.position].status = "c";
                    break;
                case "clw":
                    cells[currentCell.position] = "w";
                    //this.state.cells[currentCell.position] = "w";
                    dataCells[currentCell.position].status = "w";
                    break;
                default:
                    break;
            }
        }    
        this.setState({cells: cells});
    }

    //run forwardAStar algorithm
    //oList is the open List of cells, dataCells is the set of cells in the maze
    async forwardAStar(oList, dataCells){
        var counter = 0;
        var finalPathTaken = [];
        var finalpt = 0;

        //set search value for all states to be 0 (done in initialization)

        
        var currentCell = oList.dequeue().element;
        //var startPosition = currentCell;
        //console.log("first currentCell: " + currentCell.position);

        //check blocked status of neighbors of starting node
        this.checkNeighbors(dataCells, currentCell);


        //until goal is reached
        while(currentCell !== dataCells[this.state.goalLocation]){
            
            this.updateWalls(dataCells);
            //console.log("infinite loop current cell is: " + currentCell.position + "," + currentCell.status);
            counter++;
            currentCell.gVal = 0;
            currentCell.searchValue = counter;
            dataCells[this.state.goalLocation].gVal = Number.MAX_SAFE_INTEGER;

            var newOList = new PriorityQueue();
            var newCList = new PriorityQueue();
            
            currentCell.fVal = currentCell.gVal + currentCell.hVal;
            newOList.enqueue(currentCell, currentCell.fVal);

            var visitedCells = this.computePath(newOList, newCList, dataCells, counter);
            //console.log(visitedCells);

            //probably need to make this a function
            //b************
            if(newOList.isEmpty()){
                alert("Unable to find target");
                
                blockedMemory.fill(false);
                this.updateWalls(dataCells);

                const cells = this.state.cells.slice();
                //reset "t" cell back to clear
                if(currentCell.status !== "s")
                    cells[currentCell.position] = "c";
                
                this.setState({cells: cells,
                                inProgress: false});


                return;
            }

            if(this.state.showExtraAnimations){
                await this.animateClosedList(visitedCells);
            }
            
            //console.log(response);
            //console.log("smiles first >:(");

            //printprojectpath
            this.debugProjectedPath(dataCells, currentCell, "f");
            //animateprojectedpath


            var pointer = dataCells[this.state.goalLocation];
            var upTo = currentCell;
            var path = [];
            var pt = 0;
            //calculate path for one iteration
            //uncomment to include start position in projected path
            //path[pt] = currentCell;
            //pt++;
            while(upTo !== dataCells[this.state.goalLocation]){
                while(pointer.treePointer !== upTo){
                    pointer = pointer.treePointer;
                }
                //also pointer status to p here
                path[pt] = pointer;
                pt++;

                upTo = pointer;
                pointer = dataCells[this.state.goalLocation];
            }



            if(this.state.showExtraAnimations){
              await this.animateProjectedPath(path);
            }
            else{
                this.showProjectedPath(path);
            }

            //console.log("wait success");

            //display blocked memory
            /*
            for(let i=0; i<mazeSize; i++){
                console.log("blocked " + i + ": " + blockedMemory[i]);
            }*/


            path = [];
            pt = 0;
            pointer = dataCells[this.state.goalLocation];
            //console.log(pointer.status);
            //console.log(pointer.position);
            //console.log(pointer.treePointer);

            //add current cell position to path
            path[pt] = currentCell;
            pt++;
    
            //traverse path of tree pointers until goal or wall
            while(currentCell !== dataCells[this.state.goalLocation]){
                if(pointer.treePointer === currentCell){
                    //check if wall hit
                    if(pointer.status === "w" || pointer.status === "ws" || pointer.status === "clw" || pointer.status === "ppw"){
                        break;
                    }
                    currentCell = pointer;
                    //console.log("agent moved to " + currentCell.position);
    
                    //keep track of total final path
                    finalPathTaken[finalpt] = pointer;
                    finalpt++;

                    //keep track of this iteration
                    path[pt] = pointer;
                    pt++;
    
                    pointer = dataCells[this.state.goalLocation];
    
                    //check new neighbors for blocked status
                    this.checkNeighbors(dataCells, currentCell);
                }
                else
                    pointer = pointer.treePointer;
            }
        

            await this.animateTraversal(path);
            
            this.resetBoardStates(dataCells, visitedCells);

            //countExpanded(newCList);
            /*for(let i=0; i<mazeSize; i++){
                console.log("position: " + dataCells[i].position + " h: " + dataCells[i].hVal + " g: " + dataCells[i].gVal + " f: " + dataCells[i].fVal);
            }*/
            
        }



        console.log("goal reached at " + currentCell.position);
        console.log("final path taken: ");
        for(let i = 0; i< finalpt; i++){
            console.log("{" + finalPathTaken[i].status + " " + finalPathTaken[i].position + "} ");
        }

        //animate final path, update to prepare for next maze
        this.updateWalls(dataCells);
        await this.animateFinalPath(finalPathTaken);
        this.state.goalLocation = null;
        this.setState({inProgress: false,
                        updateNeeded: true});
    }

    //Execute the A* algorithm on the current maze
    async handleFasClick(){
        if(this.state.inProgress){
            return;
        }
        //allows maze to begin without needing to press reset after previously running the algorithm
        if(this.state.updateNeeded){
            await this.handleResetClick();
        }
        if(this.state.startLocation === null || this.state.goalLocation === null){
            alert("must have a start and goal");
            return;
        }        
        
        this.setState({inProgress: true,
                        previousMaze: this.state.cells,
                        previousStart: this.state.startLocation,
                        previousGoal: this.state.goalLocation});

        var dataCells = [];
        this.establishMaze("f", dataCells);
        var oList = new PriorityQueue();
        oList.enqueue(dataCells[this.state.startLocation], dataCells[this.state.startLocation].fVal);
        this.forwardAStar(oList, dataCells);
    }

    //Revert maze to the last completed maze
    async handleResetClick(){
        if(this.state.inProgress){
            return;
        }
        console.log("in reset click");
        // for(let i=0; i<mazeSize; i++){
        //     console.log(i + ": " + this.state.previousMaze[i]);
        // }
        return new Promise(resolve =>{
            this.setState({cells: this.state.previousMaze,
                startLocation: this.state.previousStart,
                goalLocation: this.state.previousGoal,
                updateNeeded: false});  
                resolve(); 
        });        

    }


    //renders a single cell (at index i) in the maze
    renderCell(i){
        return( 
            <Cell 
                value = {this.state.cells[i]}
                onMouseDown = {() => this.handleMouseDown(i)}
                onMouseEnter = {() => this.handleMouseEnter(i)}
                onMouseUp = {() => this.handleMouseUp(i)}/>
            );
    }
    
    render() {
        var maze = [];
        for(let i=0; i<numRows; i++){
            var row = [];
            for(let j=0; j<numColumns; j++){
                row.push(
                    <div key={i*numColumns+j} className="cell">
                        {this.renderCell(i*numColumns+j)}
                    </div>
                );
            }
            maze.push(
                <div key={"row"+i}className = "row">
                    {row}
                </div>
            );
        }

        return (
            //renders menu buttons
            //renders mazeSize cells in 5 rows of 5
            <div class="content">
                <div class="topbar">
                    <h1>A* MAZE TRAVERSAL</h1>
                </div>
                <div className = "maze">
                        {maze}
                </div>
                <div className="menu">
                    <div class="menu-row-1">
                        <button 
                            className="start-button btn-outline-primary"
                            onClick={() => this.handleButtonClick("s")}
                            selected>Place Start</button>
                        <button 
                            className="goal-button btn-outline-primary"
                            onClick={() => this.handleButtonClick("g")}
                            >Place Goal</button>
                        <button 
                            className="wall-button btn-outline-primary"
                            onClick={() => this.handleButtonClick("w")}
                            >Place Wall</button>
                        <button 
                            className="clear-button btn-outline-primary"
                            onClick={() => this.handleButtonClick("c")}
                            >Clear Cell</button>
                    </div>    
                    <div class="menu-row-2">
                        <button
                            className="ToggleAnimations btn-outline-primary"
                            onClick={() => this.handleAnimationsClick()}
                            >Toggle Extra Animations</button>
                        <button
                            className="randomize btn-outline-primary"
                            onClick={() => this.handleRandomizeClick()}
                            >Randomize Maze</button>
                        <button
                            className="clear btn-outline-primary"
                            onClick={() => this.handleClearClick()}
                            >Clear Maze</button>      
                        <button
                            className="reset btn-outline-primary"
                            onClick={() => this.handleResetClick()}>Reload Last Maze</button>
                    </div>
                    <div class="menu-row-3">
                        <button className="fas btn-outline-primary"
                            onClick={() => this.handleFasClick()}>Start!</button>
                    </div>
                </div>

                <div class="instructions">
                    <h2>Instructions</h2>
                    <p>Place a start, a goal, and some walls, then watch the AI solve the maze!</p>
                    <div class="controls">
                        <div class="button-pair">
                            <button>Place Start</button> 
                            <div class="text">Click to select, then click a location on the grid to select a starting point</div>
                        </div>
                        <div class="button-pair">
                            <button>Place Goal</button> 
                            <div class="text">Click to select, then click a location on the grid to select a goal location</div>
                        </div>    
                        <div class="button-pair">
                            <button>Place Wall</button> 
                            <div class="text">Click to select, then click a location on the grid to place an obstacle that can't be passed through</div>
                        </div>
                        <div class="button-pair">
                            <button>Clear Cell</button> 
                            <div class="text">Click to select, then click a location on the grid to remove any placed objects</div>
                        </div>
                        <div class="button-pair">
                            <button>Toggle Extra Animations</button> 
                            <div class="text">Click to toggle. When highlighted, will show all cells the agent considered entering</div>
                        </div>
                        <div class="button-pair">
                            <button>Randomize Maze</button> 
                            <div class="text">Create a random maze. Start/Goal locations are randomized. Other cells have a 30% chance to be a wall</div>
                        </div>
                        <div class="button-pair">
                            <button>Clear Maze</button> 
                            <div class="text">Revert all cells back to empty spaces</div>
                        </div>
                        <div class="button-pair">
                            <button>Reload Last Maze</button> 
                            <div class="text">Revert all cells back to the previously traversed maze</div>
                        </div>
                        <div class="button-pair">
                            <button>Start!</button> 
                            <div class="text">Start the algorithm on the current maze. Must have a start and a goal</div>
                        </div>

                    </div>

                    <h2>What is A*?</h2>
                    <div class="description">
                        <p>Repeated Forward A* is a heuristic pathfinding algorithm. An agent in a maze calculates a percieved optimal path towards the goal.
                        The agent begins with knowledge of the size of the environment, it's own location, and the location of the goal, but no knowledge of potential obstacles.
                        It keeps track of three values for each cell:</p>
                        <ul>
                            <li>The 'g' value tracks the current distance from the given cell to the agent. </li>
                            <li>The 'h' value tracks the shortest distance from the given cell to the goal regardless of possible obstacles.</li>
                            <li>The 'f' value tracks the sum of the g and h values.</li>
                        </ul>
                        <p>The algorithm proceeds in 3 main steps</p>
                        <ol>
                            <li>The agent will then determine a path following the smallest f values from it's current location to the goal.</li>
                            <li>It will then proceed along this path until either the goal is reached or an obstacle is found to be in its way.</li>
                            <li>The agent will update it's knowledge of the environment by tracking any walls it passed, and calculates a new path to avoid newly found obstacles.</li>
                        </ol>
                        <p>
                        This process will repeat until the goal is reached or it determines there is no path to the goal.                   
                        Some notes:
                        To deal with ties in f values, this agent gives precendence to cells based on their position relative to itself in the following order: below->right->above->left
                        While the agent does keep track of walls, it does not update the heuristic value in response, so it may waste time re-checking cells it wouldn't otherwise need to.
                        That algorithm is called adaptive A*, which trades off time to update heuristic values for the potential to avoid unneccessary cell checks.
                        These algorithms are not guarenteed to take an optimal path due to the possibility of running into obstacles and requiring backtracking,
                        but they do guarentee that a path is found if it exists.
                
                        The toggle animations button shows every cell the agent checked when looking for a path to take.
                        </p>
                    </div>

                </div>
            </div>
        );
    }
}

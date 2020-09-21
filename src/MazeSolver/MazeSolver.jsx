import React, {Component} from 'react';
//import Cell from './Cell/Cell';
import Maze from './Maze/Maze';
import './MazeSolver.css';
//import PriorityQueue from './PriorityQueue';

export default class MazeSolver extends Component{
    
    constructor(props){
        super(props);
        this.state = {};
    }

    render() {
        return (
            
            <div>
                
                <div className="maze">
                    <Maze />
                </div>
            </div>
        );
    }
}
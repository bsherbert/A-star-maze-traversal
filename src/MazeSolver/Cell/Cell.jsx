import React, {Component} from 'react';
import './Cell.css';

export default class Cell extends Component{
    render(){
        switch(this.props.value){
            case "c":
                return( 
                    <button 
                        className="cell open-cell"
                        onMouseDown= {() => this.props.onMouseDown()}
                        onMouseEnter= {() => this.props.onMouseEnter()}
                        onMouseUp= {() => this.props.onMouseUp()}
                    >
                        
                    </button>
                );
            case "w":
                return( 
                    <button 
                        className="cell wall-cell"
                        onMouseDown= {() => this.props.onMouseDown()}
                        onMouseEnter= {() => this.props.onMouseEnter()}
                        onMouseUp= {() => this.props.onMouseUp()}
                    >
                    </button>
                );
            case "ws":
                return( 
                    <button 
                        className="cell wall-cell-seen"
                        onMouseDown= {() => this.props.onMouseDown()}
                        onMouseEnter= {() => this.props.onMouseEnter()}
                        onMouseUp= {() => this.props.onMouseUp()}
                    >
                    </button>
                );
            case "s":
                return( 
                    <button 
                        className="cell start-cell"
                        onMouseDown= {() => this.props.onMouseDown()}
                        onMouseEnter= {() => this.props.onMouseEnter()}
                        onMouseUp= {() => this.props.onMouseUp()}
                    >

                    </button>
                );
            case "g":
                return( 
                    <button 
                        className="cell goal-cell"
                        onMouseDown= {() => this.props.onMouseDown()}
                        onMouseEnter= {() => this.props.onMouseEnter()}
                        onMouseUp= {() => this.props.onMouseUp()}
                    >

                    </button>
                );
        
            case "cl":
                return( 
                    <button 
                        className="cell cList-cell"
                        onMouseDown= {() => this.props.onMouseDown()}
                        onMouseEnter= {() => this.props.onMouseEnter()}
                        onMouseUp= {() => this.props.onMouseUp()}
                    >

                    </button>
                );    
            case "clw":
                return( 
                    <button 
                        className="cell cList-cell-w"
                        onMouseDown= {() => this.props.onMouseDown()}
                        onMouseEnter= {() => this.props.onMouseEnter()}
                        onMouseUp= {() => this.props.onMouseUp()}
                    >

                    </button>
                );
            case "pp":
                return( 
                    <button 
                        className="cell projected-path-cell"
                        onMouseDown= {() => this.props.onMouseDown()}
                        onMouseEnter= {() => this.props.onMouseEnter()}
                        onMouseUp= {() => this.props.onMouseUp()}
                    >

                    </button>
                ); 
            case "ppw":
                return(
                    <button 
                        className="cell projected-path-cell-w"
                        onMouseDown= {() => this.props.onMouseDown()}
                        onMouseEnter= {() => this.props.onMouseEnter()}
                        onMouseUp= {() => this.props.onMouseUp()}
                    >

                    </button>
                );
            case "t":
                return( 
                    <button 
                        className="cell traversed-cell"
                        onMouseDown= {() => this.props.onMouseDown()}
                        onMouseEnter= {() => this.props.onMouseEnter()}
                        onMouseUp= {() => this.props.onMouseUp()}
                    >
                        {"J"}
                    </button>
                );
            case "tg":
                return( 
                    
                    <button 
                        className="cell traversed-cell-goal"
                        onMouseDown= {() => this.props.onMouseDown()}
                        onMouseEnter= {() => this.props.onMouseEnter()}
                        onMouseUp= {() => this.props.onMouseUp()}
                    >
                        {"J"}
                    </button>
                );
            case "fp":
                return(
                    
                    <button 
                        className="cell final-path-cell"
                        onMouseDown= {() => this.props.onMouseDown()}
                        onMouseEnter= {() => this.props.onMouseEnter()}
                        onMouseUp= {() => this.props.onMouseUp()}
                    >
                       <div className="texture"></div>
                    </button>
                ); 
            default:
                return( 
                    <button 
                        className="cell open-cell"
                        onMouseDown= {() => this.props.onMouseDown()}
                        onMouseEnter= {() => this.props.onMouseEnter()}
                        onMouseUp= {() => this.props.onMouseUp()}
                    >

                    </button>
                );
        }
    }
}
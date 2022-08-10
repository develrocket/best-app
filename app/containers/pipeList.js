import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Table, Column, Cell} from 'fixed-data-table';
import * as PipeActions from '../actions/pipes';
import renderDate from '../utils/renderDate';
import '../styles/pipeList.scss';
import '../styles/fixed-data-table.scss';

class PipeList extends Component {
    static propTypes = {
        pipeList: PropTypes.array.isRequired,
        pipeListSort: PropTypes.object.isRequired,
        pipeActionListSort: PropTypes.func.isRequired,
        pipeDialogFetchData: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            width: 300,
            height: 200,
        };
    }

    componentDidMount() {
        const {resize} = this;
        window.addEventListener('resize', resize);

        setTimeout(() => {
            resize();
        }, 0);
    }

    componentWillUnmount() {
        const {resize} = this;
        window.removeEventListener('resize', resize);
    }

    handleRowClick = (e, i) => {
        const {pipeList, pipeDialogFetchData} = this.props;

        if (pipeList[i]) {
            // console.log(pipeList[i]);
            // pipeDialogFetchData(this.newPipeList[i].key);
            pipeDialogFetchData(pipeList[i].keyPipe);
        }
    };

    // handleSelect = (i) => {
    //   const { pipeList, pipeDialogFetchData } = this.props;
    //
    //   if (i) {
    //     if (pipeList[i]) {
    //       pipeDialogFetchData(this.newPipeList[i].key);
    //     }
    //   }
    // }

    resize = () => {
        const {pipeListContainer} = this.refs;
        const {clientWidth, clientHeight} = pipeListContainer;
        this.setState({
            width: clientWidth,
            height: clientHeight,
        });
    };

    sortByColumn = (e) => {
        const columnName = e.target.innerText;
        this.props.pipeActionListSort(columnName);
    };

    //
    sortFunc = (a, b) => {
        const {pipeListSort} = this.props;

        switch (pipeListSort.columnName) {
            case 'Pipe Number':
                return a.pipeNumber - b.pipeNumber;
            case 'Heat Number':
                return a.heatNumber - b.heatNumber;
            case 'Created':
                return a.created - b.created;
            default:
                return;
        }
    };

    render() {
        const {
            props,
            renderPipe,
            handleSelect,
            handleRowClick,
            state,
        } = this;
        const {pipeListSort, pipeList} = props;

        // Look into better list function
        // const newPipeList = [...this.props.pipeList].sort(this.sortFunc);
        // if (!pipeListSort.orderAsc) newPipeList.reverse();
        //
        // this.newPipeList = newPipeList;

        const rows = pipeList.map(v => {
            const {pipeNumber, heatNumber, created} = v;
            if (typeof created == "undefined") {
                var ndate = new Date();
                var mm = ndate.getMonth() + 1;
                mm = mm < 10 ? '0' + mm : mm;
                var dd = ndate.getDate();
                dd = dd < 10 ? '0' + dd : dd;
                var hh = ndate.getHours();
                hh = hh < 10 ? '0' + hh : hh;
                var mmm = ndate.getMinutes();
                mmm = mmm < 10 ? '0' + mmm: mmm;
                var ss = ndate.getSeconds();
                ss = ss < 10 ? '0' + ss : ss;
                var dateString = ndate.getFullYear() + '-' + mm + '-' + dd + ' ' + hh + ':' + mmm + ':' + ss;
                return [pipeNumber, heatNumber, dateString];
            }else {
                var ndate = created.split(".")[0];
                ndate = ndate.replace("T", " ");
                return [pipeNumber, heatNumber, ndate];
            }
        });

        return (
            <div ref="pipeListContainer" className="pipeListContainer">
                <Table
                    rowHeight={50}
                    rowsCount={rows.length}
                    width={state.width}
                    height={state.height}
                    headerHeight={50}
                    onRowClick={handleRowClick}
                >
                    <Column
                        header={<Cell>Pipe Number</Cell>}
                        cell={({rowIndex, ...props}) => (
                            <Cell>
                                {rows[rowIndex][0]}
                            </Cell>
                        )}
                        width={100}
                    />
                    <Column
                        header={<Cell>Heat Number</Cell>}
                        cell={({rowIndex, ...props}) => (
                            <Cell>
                                {rows[rowIndex][1]}
                            </Cell>
                        )}
                        width={100}
                    />
                    <Column
                        header={<Cell>Date Created</Cell>}
                        cell={({rowIndex, ...props}) => (
                            <Cell>
                                {rows[rowIndex][2]}
                            </Cell>
                        )}
                        width={100}
                    />
                </Table>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {pipeList, pipeListSort} = state;
    return {
        pipeList,
        pipeListSort,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(PipeActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PipeList);

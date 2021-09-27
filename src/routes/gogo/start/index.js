import React, { Component, Fragment } from "react";
import { injectIntl } from 'react-intl';
import {
  Row,
  Card,
  CustomInput,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonDropdown,
  UncontrolledDropdown,
  Collapse,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Input,
  CardBody,
  CardSubtitle,
  CardImg,
  Label,
  CardText,
  Badge,
  CardTitle
} from "reactstrap";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import DropdownTreeSelect from "react-dropdown-tree-select";
import "./index.css";
import 'react-dropdown-tree-select/dist/styles.css'
import data from "./data.json";


const onChange = (currentNode, selectedNodes) => {
  console.log("path::", currentNode.path);
};

const assignObjectPaths = (obj, stack) => {
  Object.keys(obj).forEach(k => {
    const node = obj[k];
    if (typeof node === "object") {
      node.path = stack ? `${stack}.${k}` : k;
      assignObjectPaths(node, node.path);
    }
  });
};

const MyMapComponent = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap defaultZoom={8} defaultCenter={{ lat: -34.397, lng: 150.644 }}>
      {props.isMarkerShown && (
        <Marker position={{ lat: -34.397, lng: 150.644 }} />
      )}
    </GoogleMap>
  ))
);


import { NavLink } from "react-router-dom";
import Select from "react-select";
import CustomSelectInput from "Components/CustomSelectInput";
import classnames from "classnames";

import IntlMessages from "Util/IntlMessages";
import { Colxx, Separator } from "Components/CustomBootstrap";
import { BreadcrumbItems } from "Components/BreadcrumbContainer";

import Pagination from "Components/List/Pagination";
import mouseTrap from "react-mousetrap";
import axios from 'axios';

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
function collect(props) {
  return { data: props.data };
}
import { servicePath } from 'Constants/defaultValues'
const apiUrl = servicePath + "/cakes/paging"

class DataListLayout extends Component {
  constructor(props) {
    super(props);
    this.toggleDisplayOptions = this.toggleDisplayOptions.bind(this);
    this.toggleSplit = this.toggleSplit.bind(this);
    this.dataListRender = this.dataListRender.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.getIndex = this.getIndex.bind(this);
    this.onContextMenuClick = this.onContextMenuClick.bind(this);


    this.state = {
      displayMode: "list",
      pageSizes: [10, 20, 30, 50, 100],
      selectedPageSize: 10,
      categories: [
        { label: 'Cakes', value: 'Cakes', key: 0 },
        { label: 'Cupcakes', value: 'Cupcakes', key: 1 },
        { label: 'Desserts', value: 'Desserts', key: 2 },
      ],
      orderOptions: [
        { column: "title", label: "Product Name" },
        { column: "category", label: "Category" },
        { column: "status", label: "Status" }
      ],
      selectedOrderOption: { column: "title", label: "Product Name" },
      dropdownSplitOpen: false,
      modalOpen: false,
      currentPage: 1,
      totalItemCount: 0,
      totalPage: 1,
      search: "",
      selectedItems: [],
      lastChecked: null,
      displayOptionsIsOpen: false,
      isLoading: false
    };
  }
  componentWillMount() {
    this.props.bindShortcut(["ctrl+a", "command+a"], () =>
      this.handleChangeSelectAll(false)
    );
    this.props.bindShortcut(["ctrl+d", "command+d"], () => {
      this.setState({
        selectedItems: []
      });
      return false;
    });
  }

  toggleModal() {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  }
  toggleDisplayOptions() {
    this.setState({ displayOptionsIsOpen: !this.state.displayOptionsIsOpen });
  }
  toggleSplit() {
    this.setState(prevState => ({
      dropdownSplitOpen: !prevState.dropdownSplitOpen
    }));
  }
  changeOrderBy(column) {
    this.setState(
      {
        selectedOrderOption: this.state.orderOptions.find(
          x => x.column === column
        )
      },
      () => this.dataListRender()
    );
  }
  changePageSize(size) {
    this.setState(
      {
        selectedPageSize: size,
        currentPage: 1
      },
      () => this.dataListRender()
    );
  }
  changeDisplayMode(mode) {
    this.setState({
      displayMode: mode
    });
    return false;
  }
  onChangePage(page) {
    this.setState(
      {
        currentPage: page
      },
      () => this.dataListRender()
    );
  }

  handleKeyPress(e) {
    if (e.key === "Enter") {
      this.setState(
        {
          search: e.target.value.toLowerCase()
        },
        () => this.dataListRender()
      );
    }
  }

  handleCheckChange(event, id) {
    if (
      event.target.tagName == "A" ||
      (event.target.parentElement &&
        event.target.parentElement.tagName == "A")
    ) {
      return true;
    }
    if (this.state.lastChecked == null) {
      this.setState({
        lastChecked: id
      });
    }

    let selectedItems = this.state.selectedItems;
    if (selectedItems.includes(id)) {
      selectedItems = selectedItems.filter(x => x !== id);
    } else {
      selectedItems.push(id);
    }
    this.setState({
      selectedItems
    });

    if (event.shiftKey) {
      var items = this.state.items;
      var start = this.getIndex(id, items, "id");
      var end = this.getIndex(this.state.lastChecked, items, "id");
      items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedItems.push(
        ...items.map(item => {
          return item.id;
        })
      );
      selectedItems = Array.from(new Set(selectedItems));
      this.setState({
        selectedItems
      });
    }
    document.activeElement.blur();
  }

  getIndex(value, arr, prop) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][prop] === value) {
        return i;
      }
    }
    return -1;
  }
  handleChangeSelectAll(isToggle) {
    if (this.state.selectedItems.length >= this.state.items.length) {
      if (isToggle) {
        this.setState({
          selectedItems: []
        });
      }
    } else {
      this.setState({
        selectedItems: this.state.items.map(x => x.id)
      });
    }
    document.activeElement.blur();
    return false;
  }
  componentDidMount() {
    this.dataListRender();
  }

  dataListRender() {

    const { selectedPageSize, currentPage, selectedOrderOption, search } = this.state;
    axios.get(`https://api.coloredstrategies.com/cakes/paging?pageSize=${selectedPageSize}&currentPage=${currentPage}&orderBy=${selectedOrderOption.column}&search=${search}`)
      .then(res => {``
        return res.data
      }).then(data => {
        this.setState({
          totalPage: data.totalPage,
          items: data.data,
          selectedItems: [],
          totalItemCount: data.totalItem,
          isLoading: true
        });
      })
  }

  onContextMenuClick = (e, data, target) => {
    console.log("onContextMenuClick - selected items", this.state.selectedItems)
    console.log("onContextMenuClick - action : ", data.action);
  };

  onContextMenu = (e, data) => {
    const clickedProductId = data.data;
    if (!this.state.selectedItems.includes(clickedProductId)) {
      this.setState({
        selectedItems: [clickedProductId]
      });
    }

    return true;
  };

  render() {
    const startIndex = (this.state.currentPage - 1) * this.state.selectedPageSize
    const endIndex = (this.state.currentPage) * this.state.selectedPageSize
    const { messages } = this.props.intl;
    assignObjectPaths(data);
    return (
      !this.state.isLoading ?
        <div className="loading"></div>
        :
        <Fragment>
          <div className="disable-text-selection">
            <Row>
              <Colxx xxs="12">
                <div className="mb-2">


                  <div className="float-sm-right">
                    {/* <Button
                      color="primary"
                      size="lg"
                      className="top-right-button"
                     
                    >
                      <IntlMessages id="Add" />
                    </Button> */}
                    {"  "}

                    <Modal
                      isOpen={this.state.modalOpen}
                      toggle={this.toggleModal}
                      wrapClassName="modal-right"
                      backdrop="static"
                    >
                      <ModalHeader toggle={this.toggleModal}>
                        <IntlMessages id="pages.add-new-modal-title" />
                      </ModalHeader>
                      <ModalBody>

                        <div className="container-fluid">
                          <div className="row">
                            <div className="Col-md-12" >
                              <DropdownTreeSelect
                                data={data}
                                onChange={onChange}
                                className="mdl-demo"
                              />
                            </div>
                          </div>
                        </div>
                      </ModalBody>

                    </Modal>
                  </div>


                </div>



              </Colxx>
            </Row>
          </div>
          <Row>
            <Colxx xxs="12">
              <Card className="mb-1" style={{ padding: `0%` }}>
                <CardBody style={{ padding: `1%` }}>
                  <CardTitle>
                    <Row>
                      <Colxx xxs="8">
                        <IntlMessages id="maps.google" />
                      </Colxx>
                      <Colxx xxs="4">
                        <Button color="primary"
                          size="md"
                          className="mb-2"
                          style={{ float: "right" }}
                          onClick={this.toggleModal}
                        >
                          <IntlMessages id="pages.add-new" />
                        </Button>
                      </Colxx>
                    </Row>


                  </CardTitle>
                  <MyMapComponent
                    isMarkerShown
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCO8MfadmlotuuHC8wmjwL_46I5QAMIiRU&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `400px` }} />}
                    mapElement={<div style={{ height: `100%`, zIndex: '0' }} />}

                  >


                  </MyMapComponent>
                </CardBody>
              </Card>
            </Colxx>

          </Row>

        </Fragment>
    );
  }
}
export default injectIntl(mouseTrap(DataListLayout))
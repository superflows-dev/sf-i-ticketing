/**
 * @license
 * Copyright 2022 Superflow.dev
 * SPDX-License-Identifier: MIT
 */

import {LitElement, html, css, PropertyValueMap} from 'lit';
import {customElement, query, queryAssignedElements, property} from 'lit/decorators.js';
import {SfISelect} from 'sf-i-select';
import {SfISubSelect} from 'sf-i-sub-select';
import {SfIEvents} from 'sf-i-events';
import {SfIUploader} from 'sf-i-uploader';
// import {customElement, query, property} from 'lit/decorators.js';
import Util from './util';
import { SfIForm } from 'sf-i-form';
// import {LitElement, html, css} from 'lit';
// import {customElement} from 'lit/decorators.js';


/*

Modes: View, Add, Edit, Delete, Admin
DB: partitionKey, rangeKey, values

*/

/**
 * SfITicketing element.
 * @fires renderComplete - When the list is populated
 * @fires valueChanged - When the value is changed
 * @property apiId - backend api id
 * @property label - input label
 * @property name - name of the input
 * @property mode - mode of operation
 * @property selectedId - id to preselect
 * @property selectedValue - callback function
 */
@customElement('sf-i-ticketing')
export class SfITicketing extends LitElement {
  
  searchPhraseOriginal = "";
  blockSize = 10;
  VALIDATION_TEXT_BASIC = "text-basic"
  VALIDATION_TEXT_DATE = "text-date"
  VALIDATION_SELECT = "select"

  @property()
  mode!: string;

  @property()
  userid!: string;

  @property()
  username!: string;

  @property()
  flow: string = "";

  @property()
  showCalendar: boolean = false;

  @property()
  searchPhrase: string = "";

  @property()
  selectProjection!: string;

  @property()
  selectAnotherProjection!: string;

  @property()
  ignoreProjections: string = "[]";

  getIgnoreProjections = () => {

    try {
      return JSON.parse(this.ignoreProjections)
    } catch (e) {
      return [];
    }

  }

  @property()
  dependencies: string = "[]";

  @property()
  inputIds: string = "[]";

  @property()
  fields: string = "[]";

  @property()
  validations: string = "[]";

  @property()
  selectedViewToDetailValues: string = "[]";

  @property()
  useInApi: string = "[]";

  @property()
  unitFiltersNew: string = "[]";

  @property()
  unitFiltersDetail: string = "[]";

  @queryAssignedElements({slot: 'form'})
  _sfSlottedForm: any;

  @property()
  apiId!: string;

  @property()
  apiIdCalendarDetail: string = "";

  @property()
  searchIndex!: string;

  @property()
  selectedId!: string;

  @property()
  selectedProjectId!: string;

  @property()
  selectedTicketDetails!: any;

  @property()
  selectedSearchId: string[] = [];

  @property()
  searchParams: any = {};

  @property()
  searchInputIds: string = "[]";

  @property()
  preselectedValues!: string;
  
  getPreselectedValues = () => {

    try {
      return JSON.parse(this.preselectedValues);
    } catch (e) {
      return [];
    }

  }

  @property()
  label!: string;

  @property()
  latestDaysBlock: number = 7;

  @property()
  name!: string;

  @property()
  shortlistedSearchPhrases: any = {};

  @property()
  removedValues: string[] = [];

  @property()
  selectedTextPhrase: string = "";

  @property()
  projectField: string = "";

  @property()
  prevCursor: Array<any> = [];

  @property()
  nextCursor: Array<any> = [];
  
  @property()
  noLatestMessage: string = "";
  
  @property()
  titleMessage: string = "";

  @property()
  multiselectArr: Array<string> = [];

  @property()
  decryptProjectId: string = "";

  @property()
  decryptFileName: string = "";

  selectedValues = () => {

    if(this.mode == "multiselect-dropdown") {

      const values = [];

      var divArr = (this._SfSearchMultiselectSelected as HTMLDivElement).querySelectorAll('div');

      for(var i = 0; i < divArr.length; i++) {

        values.push(divArr[i].innerHTML);

      }

      return values;

    } else if(this.mode == "list" || this.mode == "select" ) {

      const values = [];

      const checkboxes = (this._SfSearchSelectContainer as HTMLElement).querySelectorAll('input');
  
      const len = checkboxes.length;
      for (var i = 0; i < len; i++) {
        const cb = checkboxes[i] as HTMLInputElement;
        if(cb.checked) {
          values.push(cb.value);
        }
      }
  
      return values;
  
    } else {

      const values = [];

      const len = this._sfInputSelect.options.length;
      for (var i = 0; i < len; i++) {
        const opt = this._sfInputSelect.options[i];
        if (opt.selected && opt.value != "noselect") {
          values.push(opt.value);
        }
      }
  
      console.log('returning values', values);
  
      return values;
    }

  }

  selectedTexts = () => {

    if(this.mode == "multiselect-dropdown") {

      const values = [];

      var divArr = (this._SfSearchMultiselectSelected as HTMLDivElement).querySelectorAll('div');

      for(var i = 0; i < divArr.length; i++) {

        values.push(divArr[i].innerHTML);

      }

      return values;

    } if(this.mode == "list" || this.mode == "select") {

      const values = [];

      const checkboxes = (this._SfSearchSelectContainer as HTMLElement).querySelectorAll('input');
      const divs = (this._SfSearchSelectContainer as HTMLElement).querySelectorAll('.append-str');
  
      const len = divs.length;
      for (var i = 0; i < len; i++) {
        const div = divs[i] as HTMLDivElement;
        const cb = checkboxes[i] as HTMLInputElement;
        if(cb.checked) {
          values.push(div.innerHTML);
        }
      }
  
      return values;
  
    } else {

      const values = [];

      const len = this._sfInputSelect.options.length;
      for (var i = 0; i < len; i++) {
        const opt = this._sfInputSelect.options[i];
        if (opt.selected && opt.value != "noselect") {
          values.push(this._sfInputSelect.options[i].text)
        }
      }

      return values;

    }

  }

  @property()
  searchFilterIds: any[] = ["search-project", "search-initiator", "search-assignedto", "search-category", "search-priority", "search-status"];

  // @property()
  // selectedListSearchItemsValues: any[] = [];

  // @property()
  // selectedListSearchItemsTexts: any[] = [];

  // @property()
  // selectedValue = () => {
  //   return this._SfInputSelect.value;
  // }

  static override styles = css`

    
    .SfITicketingC {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: space-between;
      overflow-x: auto;
    }

    .SfITicketingCAdmin {
      padding: 10px 20px;
    }

    .SfITicketingC label{
      padding-bottom: 5px;
    }

    .SfITicketingC > div{
      display: flex;
      align-items: center;
    }

    .SfITicketingC > div > select{
      flex-grow: 1;
    }

    .pointer {
      cursor: pointer;
    }

    input:not([type='radio']):not([type='checkbox']) {

      font-weight: 400;
      border: none;
      padding: 10px;
      border-radius: 5px;
      background: #efefef;
      box-shadow: inset 3px 3px 5px #bbbbbb,
                  inset -5px -5px 8px #ffffff;
      border-top: solid 1px rgba(255, 255, 255, 0.8);
      border-left: solid 1px rgba(255, 255, 255, 0.8);
      border-bottom: solid 1px rgba(255, 255, 255, 0.8);
      border-right: solid 1px rgba(255, 255, 255, 0.8);
      transition: 0.3s;
      margin-bottom: 0px;
  
      }

    .badge-multiselected {
      font-size: 70%;
      padding: 5px;
      border-radius: 10px;
      border: solid 1px #dddddd;
      white-space: nowrap;
      overflow: hidden !important;
      width: 50px;
    }

    ul {
      list-style-type:none;
    }

    .flex-wrap {
      flex-wrap: wrap;
    }

    .mb-10 {
      margin-bottom: 10px;
    }

    .mt-10 {
      margin-top: 10px;
    }

    .flex-grow {
      flex-grow: 1;
    }

    .text-center {
      text-align:center;
    }

    .left-sticky {
      left: 0px;
      position: sticky;
    }

    .border-right-solid {
      border-right: solid 1px gray;
    }

    .link {
      text-decoration: underline;
      cursor: pointer;
    }

    .gone {
      display: none
    }

    .loader-element {
      position: fixed;
      right: 10px;
      top: 10px;
      margin-left: 5px;
    }

    .color-gray {
      color: gray;
    }

    .td-head {
      text-transform: capitalize;
    }


    .td-body {
      padding: 5px;
    }

    .td-dark {
      background-color: #e9e9e9;
    }

    .td-highlight {
      background-color: black;
      color: white;
    }

    .td-light {
      background-color: #f6f6f6;
    }

    .align-start {
      align-items: flex-start;
    }

    .align-end {
      align-items: flex-end;
    }

    .align-center {
      align-items: center;
    }
    .align-stretch {
      align-items: stretch;
    }

    #form-container {
      width: 90%;
    }

    #search-list-container {
      overflow-x: auto;
      width: 90%;
    }

    #calendar-container {
      width: 90%;
    }

    .button-icon-small-cancel{
      font-size: 100%;
      margin-right: 3px;
    }
    #search-select-container {
      overflow-x: auto;
      width: 100%;
    }

    #logs-list-container {
      overflow-x: auto;
      width: 90%;
    }

    #logs-list-container {
      overflow-x: auto;
    }

    #latest-list-container {
      overflow-x: auto;
      flex-direction: column;
    }

    #input-search {
      margin-bottom: 5px;
      width: 300px;
    }
    
    .button-icon {
      padding-top: 8px;
      padding-bottom: 6px;
      padding-left: 10px;
      padding-right: 10px;
      margin-left: 5px;
      cursor: pointer;
    }

    .button-icon-small {
      padding-top: 2px;
      padding-bottom: 2px;
      padding-left: 2px;
      padding-right: 2px;
      margin: 0px;
      font-size: 85%;
      cursor: pointer;
    }

    .SfITicketingC td {
      vertical-align: top;
    }

    .lds-dual-ring {
      display: inline-block;
      width: 50px;
      height: 50px;
    }
    .lds-dual-ring:after {
      content: " ";
      display: block;
      width: 50px;
      height: 50px;
      margin: 0px;
      border-radius: 50%;
      border: 2px solid #fff;
      border-color: #888 #ddd #888 #ddd;
      background-color: white;
      animation: lds-dual-ring 0.8s linear infinite;
    }

    .lds-dual-ring-lg {
      display: inline-block;
      width: 30px;
      height: 30px;
    }
    .lds-dual-ring-lg:after {
      content: " ";
      display: block;
      width: 30px;
      height: 30px;
      margin: 0px;
      border-radius: 50%;
      border: 3px solid #fff;
      border-color: #888 #ddd #888 #ddd;
      animation: lds-dual-ring 0.8s linear infinite;
    }

    td {
      white-space: nowrap;
    }

    .div-row-error {
      display: flex;
      justify-content: center;
      position: fixed;
      position: fixed;
      top: 0px;
      right: 0px;
      margin-top: 20px;
      margin-right: 20px;
      display: none;
      align-items:center;
      background-color: white;
      border: dashed 1px red;
      padding: 20px;
    }

    .div-row-error-message {
      color: red;
      padding: 5px;
      background-color: white;
      text-align: center;
    }

    .div-row-notif {
      display: flex;
      justify-content: center;
      position: fixed;
      top: 0px;
      left: 0px;
      margin-top: 20px;
      margin-left: 20px;
      display: none;
      align-items:center;
      background-color: white;
      border: dashed 1px blue;
      padding: 20px;
    }

    .div-row-notif-message {
      color: blue;
      padding: 5px;
      background-color: white;
      text-align: center;
    }

    .div-row-success {
      display: flex;
      justify-content: center;
      position: fixed;
      top: 0px;
      right: 0px;
      margin-top: 20px;
      margin-right: 20px;
      display: none;
      align-items:center;
      background-color: white;
      border: dashed 1px green;
      padding: 20px;
    }

    .div-row-success-message {
      color: green;
      padding: 5px;
      background-color: white;
      text-align: center;
    }

    #search-multiselect-select {
      width: 170px;
    }

    #search-multiselect-input {
      width: 150px;
    }

    .d-flex {
      display: flex;
    }

    .flex-col {
      flex-direction: column;
    }

    .justify-start {
      justify-content: flex-start;
    }

    .justify-center {
      justify-content: center;
    }

    .justify-between {
      justify-content: space-between;
    }
    .justify-around {
      justify-content: space-around;
    }

    .justify-end {
      justify-content: flex-end;
    }

    @keyframes lds-dual-ring {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }  

    .hide {
      display: none;
    }

    .hide-important {
      display: none !important; 
    }

    .badge {
      margin-top: -20px;
    }

    .badge-filled {
      border: solid 1px gray;
      background-color: white;
      padding-top: 1px;
      padding-bottom: 1px;
      padding-left: 10px;
      padding-right: 10px;
      border-radius: 20px;
      margin-top: -20px;
    }

    .lb {
      width: 5%
    }
    .rb {
      width: 5%
    }

    .tcId {
      min-width: 300px;
    }

    .tcName {
      min-width: 200px;
    }

    .tcActions {
      min-width: 150px;
      text-align: right;
    }

    .SfITicketingCAdmin th {
      border-bottom: solid 1px black
    }

    .SfITicketingCAdmin td {
      border-bottom: solid 1px gray
    }

    .tableC {
      overflow-x: auto;
    }

    #button-submit {
      padding: 10px;
    }
    

    @media (orientation: landscape) {

      .lb {
        width: 30%
      }
      .rb {
        width: 30%
      }

      #search-list-container {
        overflow-x: auto;
        width: 40%;
      }

      #search-select-container {
        overflow-x: auto;
        width: 100%;
      }

      #logs-list-container {
        overflow-x: auto;
        width: 40%;
      }

      #latest-list-container {
        overflow-x: auto;
      }

      #form-container {
        width: 40%;
      }

      #calendar-container {
        width: 40%;
      }
  
    }

    .w-100 {
      width: 100%;
    }

    .search-input {
      flex: 1
    }

    .row-gap-5 {
      gap: 5px
    }

  `;
  
  @query('#button-submit')
  _sfButtonSubmit: any;

  @query('#button-all')
  _sfButtonAll: any;

  @query('#button-calendar-cancel')
  _sfButtonCalendarCancel: any;

  @query('#button-calendar')
  _sfButtonCalendar: any;

  // @query('#input-search')
  // _sfInputSearch: any;

  @query('#input-select')
  _sfInputSelect: any;

  @query('#select-search-input')
  _sfInputSearchSelect: any;

  @query('#input-list')
  _sfInputList: any;

  @query('#sf-button-delete')
  _sfButtonDelete: any;

  @query('.div-row-error')
  _SfRowError: any;

  @query('.div-row-error-message')
  _SfRowErrorMessage: any;

  @query('.div-row-success')
  _SfRowSuccess: any;

  @query('.div-row-success-message')
  _SfRowSuccessMessage: any;

  @query('.div-row-notif')
  _SfRowNotif: any;

  @query('.div-row-notif-message')
  _SfRowNotifMessage: any;

  @query('.loader-element')
  _SfLoader: any;

  @query('#form-container')
  _SfFormContainer: any;
  
  @query('#calendar-container')
  _SfCalendarContainer: any;
  
  @query('#search-list-container')
  _SfSearchListContainer: any;

  @query('#search-select-container')
  _SfSearchSelectContainer: any;

  @query('#search-filters-container')
  _SfSearchFiltersContainer: any;

  @query('#search-badge')
  _SfSearchBadge: any;

  @query('#search-startdate')
  _SfSearchStartDate: any;

  @query('#search-enddate')
  _SfSearchEndDate: any;

  @query('#logs-list-container')
  _SfLogsListContainer: any;

  @query('#latest-list-container')
  _SfLatestListContainer: any;

  @query('#button-back')
  _SfButtonBack: any;

  @query('#button-edit')
  _SfButtonEdit: any;

  @query('#button-delete')
  _SfButtonDelete: any;

  @query('#button-new')
  _SfButtonNew: any;

  @query('#button-delete-confirm')
  _SfButtonDeleteConfirm: any;

  @query('#search-multiselect-select')
  _SfSearchMultiselectSelect: any;

  @query('#search-multiselect-input')
  _SfSearchMultiselectInput: any;

  @query('#search-multiselect-delete')
  _SfSearchMultiselectDelete: any;

  @query('#search-multiselect-selected')
  _SfSearchMultiselectSelected: any;

  @query('#button-edit-cancel')
  _SfButtonEditCancel: any;

  @query('#button-delete-cancel')
  _SfButtonDeleteCancel: any;

  @query('#sf-i-events')
  _SfIEvents: any;

  // @query('#button-copypaste-open')
  // _SfButtonCopypasteOpen: any;

  // @query('#button-copypaste-copy')
  // _SfButtonCopypasteCopy: any;

  // @query('#button-copypaste-paste')
  // _SfButtonCopypastePaste: any;

  @query('#input-startdate')
  _SfInputStartDate: any;

  @query('#input-enddate')
  _SfInputEndDate: any;

  @query('#button-fetch-log')
  _SfButtonFetchLog: any;

  @queryAssignedElements({slot: 'form'})
  _SfFormC: any;

  @queryAssignedElements({slot: 'calendar'})
  _SfCalendarC: any;

  @query('#decrypt-container')
  _SfDecryptContainer: any;

  @query('#sf-i-project-decrypt')
  _SfDecryptProjectInput: any;

  @query('#input-decrypt')
  _SfDecryptFileInput: any;

  @query('#button-decrypt')
  _SfDecryptButton: any;

  getInputFromField = (field: string) => {

    for(var i = 0; i < this.getFields().length; i++) {

      if(field == this.getFields()[i]) {
        return this.getInputs()[i];
      }

    }

  }

  getFieldFromInput = (input: string) => {

    for(var i = 0; i < this.getInputs().length; i++) {

      if(input == this.getInputs()[i]) {
        return this.getFields()[i];
      }

    }

  }

  getUseInApi = () => {
    return JSON.parse(this.useInApi);
  }

  getUnitFiltersNew = () => {
    return JSON.parse(this.unitFiltersNew);
  }

  getUnitFiltersDetail = () => {
    return JSON.parse(this.unitFiltersDetail);
  }

  getSelectedViewToDetailValues = () => {
    return JSON.parse(this.selectedViewToDetailValues);
  }

  getFields = () => {
    return JSON.parse(this.fields);
  }

  getValidations = () => {
    return JSON.parse(this.validations);
  }

  getDependencies = () => {
    return JSON.parse(this.dependencies);
  }

  getInputs = () => {
    return JSON.parse(this.inputIds);
  }

  dispatchMyEvent = (ev: string, args?: any) => {

    console.log('dispatching event', ev, args);
    const event = new CustomEvent(ev, {detail: args, bubbles: true, composed: true});
    this.dispatchEvent(event);

  }

  onChangeSelect = (ev: any) => {

    this.dispatchMyEvent("valueChanged", {newValue: ev.target.value, newText: ev.target.options[ev.target.selectedIndex].text});

    // console.log('change', this.selectedListSearchItemsTexts, this.selectedListSearchItemsValues);

  }

  clearSelection = () => {
    // if(this.mode == "select") {
    //   this._sfInputSelect.value = 'noselect';
    // }
    // if(this.mode == "list") {
    //   this._sfInputList.value = 'noselect';
    // }
  }

  // getSelectedSearchId = () => {
  //   return this.selectedSearchId;
  // }

  // getSelectedSearchValue = () => {
  //   return (this._sfInputSelect as HTMLSelectElement).value;
  // }
  
  getSelectedSearchText = () => {
    if(this._sfInputSelect.selectedIndex >= 0) {
      return this._sfInputSelect.options[this._sfInputSelect.selectedIndex].text;
    } else {
      return null;
    }
  }

  getInputValue = (id: string) => {
    console.log('id', this._SfFormC, (this._SfFormC[0].querySelector('#' + id) as HTMLElement).tagName);
    console.log('field getuseapi', this.getUseInApi());
    var value = null;

    if((this._SfFormC[0].querySelector('#' + id) as HTMLElement).tagName.toLowerCase() == "sf-i-select") {
      if((this._SfFormC[0].querySelector('#' + id) as HTMLElement).style.display == "none") {
        if(this.getUseInApi().includes(this.getFieldFromInput(id))) {
          value = {
            type: "sf-i-select",
            value: (this._SfFormC[0].querySelector('#' + id) as SfISelect).selectedValues(),
            text: (this._SfFormC[0].querySelector('#' + id) as SfISelect).selectedTexts()  
          }
        } else {
          value = {
            type: "sf-i-select",
            value: [],
            text: []  
          }
        }
      } else {
        value = {
          type: "sf-i-select",
          value: (this._SfFormC[0].querySelector('#' + id) as SfISelect).selectedValues(),
          text: (this._SfFormC[0].querySelector('#' + id) as SfISelect).selectedTexts()  
        }
      }
    } else if ((this._SfFormC[0].querySelector('#' + id) as HTMLElement).tagName.toLowerCase() == "sf-i-sub-select") {
      if((this._SfFormC[0].querySelector('#' + id) as HTMLElement).style.display == "none") {
        if(this.getUseInApi().includes(this.getFieldFromInput(id))) {
          value = {
            type: "sf-i-sub-select",
            value: (this._SfFormC[0].querySelector('#' + id) as SfISubSelect).selectedValues(),
            text: (this._SfFormC[0].querySelector('#' + id) as SfISubSelect).selectedTexts()  
          }
        } else {
          value = {
            type: "sf-i-sub-select",
            value: [],
            text: []  
          }
        }
      } else {
        value = {
          type: "sf-i-sub-select",
          value: (this._SfFormC[0].querySelector('#' + id) as SfISubSelect).selectedValues(),
          text: (this._SfFormC[0].querySelector('#' + id) as SfISubSelect).selectedTexts()  
        }
      }
      
    } else if ((this._SfFormC[0].querySelector('#' + id) as HTMLElement).tagName.toLowerCase() == "sf-i-form") {
      if((this._SfFormC[0].querySelector('#' + id) as HTMLElement).style.display == "none") {
        if(this.getUseInApi().includes(this.getFieldFromInput(id))) {
          value = {
            type: "sf-i-form",
            value: (this._SfFormC[0].querySelector('#' + id) as SfIForm).selectedValues(),
            text: (this._SfFormC[0].querySelector('#' + id) as SfIForm).selectedTexts()  
          }
        } else {
          value = {
            type: "sf-i-form",
            value: [],
            text: []  
          }
        }
      } else {
        value = {
          type: "sf-i-form",
          value: (this._SfFormC[0].querySelector('#' + id) as SfIForm).selectedValues(),
          text: (this._SfFormC[0].querySelector('#' + id) as SfIForm).selectedTexts()  
        }
      }
      
    } else if ((this._SfFormC[0].querySelector('#' + id) as HTMLElement).tagName.toLowerCase() == "sf-i-uploader") {
      if((this._SfFormC[0].querySelector('#' + id) as HTMLElement).style.display == "none") {
        if(this.getUseInApi().includes(this.getFieldFromInput(id))) {
          value = {
            type: "sf-i-uploader",
            value: (this._SfFormC[0].querySelector('#' + id) as SfIUploader).selectedValues(),
            text: (this._SfFormC[0].querySelector('#' + id) as SfIUploader).selectedTexts()  
          }
        } else {
          value = {
            type: "sf-i-uploader",
            value: [],
            text: []  
          }
        }
      } else {
        value = {
          type: "sf-i-uploader",
          value: (this._SfFormC[0].querySelector('#' + id) as SfIUploader).selectedValues(),
          text: (this._SfFormC[0].querySelector('#' + id) as SfIUploader).selectedTexts()  
        }
      }
      
    } else if ((this._SfFormC[0].querySelector('#' + id) as HTMLElement).tagName.toLowerCase() == "select") {
      if((this._SfFormC[0].querySelector('#' + id) as HTMLElement).style.display == "none") {
        if(this.getUseInApi().includes(this.getFieldFromInput(id))) {
          value = {
            type: "select",
            value: (this._SfFormC[0].querySelector('#' + id) as HTMLSelectElement).value,
            text: (this._SfFormC[0].querySelector('#' + id) as HTMLSelectElement).options[(this._SfFormC[0].querySelector('#' + id) as HTMLSelectElement).selectedIndex].text  
          }
        } else {
          value = {
            type: "select",
            value: "",
            text: ""  
          }
        }
      } else {
        value = {
          type: "select",
          value: (this._SfFormC[0].querySelector('#' + id) as HTMLSelectElement).value,
          text: (this._SfFormC[0].querySelector('#' + id) as HTMLSelectElement).options[(this._SfFormC[0].querySelector('#' + id) as HTMLSelectElement).selectedIndex].text
        }
      }
      
    } else {
      if((this._SfFormC[0].querySelector('#' + id) as HTMLElement).style.display == "none") {
        if(this.getUseInApi().includes(this.getFieldFromInput(id))) {
          value = (this._SfFormC[0].querySelector('#' + id)).value;
          value = {
            type: "input",
            value: (this._SfFormC[0].querySelector('#' + id)).value
          }
        } else {
          value = (this._SfFormC[0].querySelector('#' + id)).value;
          value = {
            type: "input",
            value: ""
          }
        }
      } else {
        value = (this._SfFormC[0].querySelector('#' + id)).value;
        value = {
          type: "input",
          value: (this._SfFormC[0].querySelector('#' + id)).value
        }
      }
      
    }

    return value;
  }

  prepareXhr = async (data: any, url: string, loaderElement: any, authorization: any) => {

    
    if(loaderElement != null) {
      loaderElement.innerHTML = '<div class="lds-dual-ring"></div>';
    }
    return await Util.callApi(url, data, authorization);

  }

  clearMessages = () => {
    this._SfRowError.style.display = 'none';
    this._SfRowErrorMessage.innerHTML = '';
    this._SfRowSuccess.style.display = 'none';
    this._SfRowSuccessMessage.innerHTML = '';
  }

  setError = (msg: string) => {
    this._SfRowError.style.display = 'flex';
    this._SfRowErrorMessage.innerHTML = msg;
    this._SfRowSuccess.style.display = 'none';
    this._SfRowSuccessMessage.innerHTML = '';
    // this._SfRowNotif.style.display = 'none';
    // this._SfRowNotifMessage.innerHTML = '';
  }

  setSuccess = (msg: string) => {
    this._SfRowError.style.display = 'none';
    this._SfRowErrorMessage.innerHTML = '';
    this._SfRowSuccess.style.display = 'flex';
    this._SfRowSuccessMessage.innerHTML = msg;
    // this._SfRowNotif.style.display = 'none';
    // this._SfRowNotifMessage.innerHTML = '';
  }

  setNotif = (msg: string) => {
    this._SfRowError.style.display = 'none';
    this._SfRowErrorMessage.innerHTML = '';
    this._SfRowSuccess.style.display = 'none';
    this._SfRowSuccessMessage.innerHTML = '';
    this._SfRowNotif.style.display = 'flex';
    this._SfRowNotifMessage.innerHTML = msg;
  }

  setListSelection = (value: string, text: string) => {
    
    // if(!this.selectedListSearchItemsValues.includes(value)) {
    //   this.selectedListSearchItemsValues.push(value);
    //   this.selectedListSearchItemsTexts.push(text);
    // } else {
    //   var index = this.selectedListSearchItemsValues.indexOf(value);
    //   if (index !== -1) {
    //     this.selectedListSearchItemsValues.splice(index, 1);
    //     this.selectedListSearchItemsTexts.splice(index, 1);
    //   }
    // }

    this.dispatchMyEvent("valueChanged", {newValue: value, newText: text});
    // console.log(this.selectedListSearchItemsTexts, this.selectedListSearchItemsValues);

  }

  clickTableNextList = (cursor: any) => {
    
    this.prevCursor.push(this.prevCursor.length === 0 ? 'initial': this.nextCursor[this.nextCursor.length - 1]);
    this.nextCursor.push(cursor);

    this.fetchSearchSelect(this.nextCursor[this.nextCursor.length - 1]);

  }

  clickTableNext = (cursor: any) => {
    
    this.prevCursor.push(this.prevCursor.length === 0 ? 'initial': this.nextCursor[this.nextCursor.length - 1]);
    this.nextCursor.push(cursor);

    this.fetchSearch(this.nextCursor[this.nextCursor.length - 1]);

  }

  clickTablePrev = () => {

    if(this.nextCursor.length > 0) {
      this.nextCursor.pop();
      this.prevCursor.pop();
    }

    console.log('clicked prev', this.prevCursor, this.nextCursor);

    if(this.nextCursor.length > 1) {
      this.fetchSearch(this.nextCursor[this.nextCursor.length - 1]);
    } else {
      this.fetchSearch();
    }
    

  }

  renderSearch = (values: any) => {

    let html = '';

    if(values.length > 0) {

      html += '<h3 part="results-title" class="left-sticky">Search Results ('+values.length+')</h3>'
      
      html += '<table>';

      html += '<thead>';

      html += '</thead>'

      for(var i = 0; i < values.length; i++) {


        // const cols = JSON.parse(values[i].fields.cols);
        const cols = Object.keys(values[i]);

        // console.log(JSON.parse(values[i].fields.data));
        let data = Object.values(values[i]) as any[];


        var classBg = "";

        if(i%2 === 0) {
          classBg = 'td-light';
        } else {
          classBg = 'td-dark';
        }

        html += '<tr>';
        html += '<td part="td-action" class="left-sticky">';
        html += '<div id="search-'+i+'"><button part="button" class="button-search-view">View</button></div>';
        html += '</td>';
        html += '<td part="td-body" class="td-body '+classBg+'">';
        html += ('<div part="row-col-title">id</div>')
        html +=  ('<sf-i-elastic-text text="'+values[i].id+'" minLength="10"></sf-i-elastic-text>');
        html += '</td>';
        for(var j = 0; j < cols.length; j++) {

          console.log('getignoreprojects', this.getIgnoreProjections());

          if(!this.getIgnoreProjections().includes(cols[j])) {
            html += '<td part="td-body" class="td-body '+classBg+'">';
            html += ('<div part="row-col-title">'+cols[j]+'</div>')
            if(Array.isArray(data[j])) {
              console.log("isArray", cols[j])
              if(data[j][0] != null && Util.isJsonString(data[j][0]) && JSON.parse(data[j][0])['key'] != null && JSON.parse(data[j][0])['ext'] != null) {
                  html += ('<sf-i-elastic-text text="files['+data[j].length+']" minLength="20"></sf-i-elastic-text>')
              } else {
                for(var k = 0; k < data[j].length; k++) {
                  html +=  ('<sf-i-elastic-text text="'+data[j][k]+'" minLength="20"></sf-i-elastic-text>');
                  if(k < (data[j].length - 1)) {
                    html += "; ";
                  }
                }
              }

            } else if(Object.keys(data[j]).length > 1 && data[j]['text'] != null){
              console.log('object.keys', cols[j], Object.keys(data[j]).length)
              html += ('<sf-i-elastic-text text="'+data[j]['text']+'" minLength="20"></sf-i-elastic-text>')
            } else if(!isNaN(data[j])) {
              html += ('<sf-i-elastic-text text="'+(new Date(parseInt(data[j])).toLocaleDateString()) + "-" + (new Date(parseInt(data[j])).toLocaleTimeString())+'" minLength="50"></sf-i-elastic-text>')
            } else {
              html += ('<sf-i-elastic-text text="'+data[j]+'" minLength="20"></sf-i-elastic-text>')
            }
            html += '</td>';
          }

        }

        html += '</tr>';


      }
      html += '</table>';
      this._SfSearchListContainer.innerHTML = html;

      for(var i = 0; i < values.length; i++) {

        //console.log(this._SfSearchListContainer.querySelector('#search-' + i))
        this._SfSearchListContainer.querySelector('#search-' + i).addEventListener('click', (ev: any) => {
          // console.log('id', ev.currentTarget.id)
          this.selectedId = values[parseInt((ev.currentTarget.id + "").split('-')[1])].id
          this.selectedProjectId = values[parseInt((ev.currentTarget.id + "").split('-')[1])]['project']['value'][0]
          this.mode = "detail";
          this.loadMode();
        });

      }

    } else {

      html += '<h3>No Records Found</h3>'
      this._SfSearchListContainer.innerHTML = html;

    }

  }

  renderListRows = (values: any, multiSelect: boolean) => {

    console.log('renderlistrows', values);

    var html = '';

    for(var i = 0; i < values.length; i++) {


      let data = JSON.parse(values[i].fields.data);
      let cols = JSON.parse(values[i].fields.cols);


      var classBg = "";

      if(i%2 === 0) {
        classBg = 'td-light';
      } else {
        classBg = 'td-dark';
      }

      var appendStr = "";
      for(var j = 0; j < cols.length; j++) {
        // console.log('data[j]', data[j]);
        if(!this.getIgnoreProjections().includes(cols[j])) {

          if(Array.isArray(data[j])) {

            for(var k = 0; k < data[j].length; k++) {
              appendStr +=(data[j][k] + " ");
              if(k < (data[j].length - 1)) {
                appendStr += "";
              }
            }
  
          } else {
            appendStr += (data[j] + " ");
          }

        }
        
        //console.log('append', appendStr);
      }

      var checked = '';

      if(this.selectedSearchId.includes(values[i].id)) {
        checked = "checked";
      } else {
        checked = "";
      }

      var disabled = '';

      if(this.flow == "read") {
        disabled = 'disabled';
      }
      if(this.flow == "read" && checked != "checked"){
        continue;
      }
      html += '<tr>';
      html += '<td part="td-action" class="left-sticky">';
      if(multiSelect) {
        html += '<div><input id="search-'+i+'" part="input-checkbox" type="checkbox" value="'+values[i].id+'" '+checked+' '+disabled+'/><div class="append-str gone">'+appendStr+'</div></div>';
      } else {
        html += '<div><input id="search-'+values[i].id+'" class="search-select-input" name="select-statute" part="input-checkbox" type="radio" value="'+values[i].id+'" '+checked+' '+disabled+'/><div class="append-str gone">'+appendStr+'</div></div>';
      }
      
      html += '</td>';
      
      for(j = 0; j < cols.length; j++) {

       // console.log('data', data[j]);

        if(!this.getIgnoreProjections().includes(cols[j])) {

          html += '<td part="td-body" class="td-body '+classBg+'">';
          if(Array.isArray(data[j])) {
            if(data[j][0] != null && Util.isJsonString(data[j][0]) && JSON.parse(data[j][0])['key'] != null && JSON.parse(data[j][0])['ext'] != null) {
              html += 'files['+data[j].length+']'
            } else {
              for(var k = 0; k < data[j].length; k++) {
                
                html += data[j][k];
                if(k < (data[j].length - 1)) {
                  html += " &nbsp; ";
                }
              }
            }

          } else {
            html += data[j]
          }
          html += '</td>';

        }

      }
      html += '</tr>';

    }

    return html;

  }

  renderList = (values: any, found: any, cursor: any, multiSelect: boolean = false) => {

    console.log('renderlist', values, this.nextCursor);

    let html = '';

    if(values.length > 0 && this.nextCursor.length === 0) {
      if(this.flow != "read"){
        html += '<h3 part="results-title" class="left-sticky">Search Results ('+found+')</h3>'
      }
      html += '<table id="select-list-table">';
      //console.log('search', values)

      const cols = JSON.parse(values[0].fields.cols);

      html += '<thead>';
      html += '<th part="td-action" class="td-head left-sticky">'
      html += 'Action';
      html += '</th>'
      for(var i = 0; i < cols.length; i++) {
        if(!this.getIgnoreProjections().includes(cols[i])) {
          html += '<th part="td-head" class="td-head">'
          html += cols[i]
          html += '</th>'
        }
      }
      html += '</thead>'

      html += this.renderListRows(values, multiSelect);
      
      html += '</table>';

      if(values.length === this.blockSize && this.flow != "read") {
        html += '<div id="down-indicator" class="d-flex justify-start align-center mt-10 left-sticky">';
        html += '<span part="td-head" id="page-num">&nbsp;&nbsp;'+(this.prevCursor.length+1) + "/" + (Math.ceil(parseInt(found)/this.blockSize))+'&nbsp;&nbsp;</span>'
        html += '<button id="button-next-cursor" part="button-icon-small" class="material-icons">expand_more</button>&nbsp;&nbsp;';
        html += '</div>';
      }

      this._SfSearchSelectContainer.innerHTML = html;

      const inputElements = (this._SfSearchSelectContainer as HTMLDivElement).querySelectorAll('.search-select-input') as NodeListOf<HTMLInputElement>;

      console.log('inputs', inputElements);

      for(var i = 0; i < inputElements.length; i++) {

        (inputElements[i] as HTMLInputElement).addEventListener('click', () => {
          //console.log('event', (ev.currentTarget as HTMLInputElement).id);
          this.dispatchMyEvent("valueChanged", {newValue: {}, newText: {}});
        })

      }

      // for(var i = 0; i < values.length; i++) {

      //  // console.log(this._SfSearchSelectContainer.querySelector('#search-' + i))
      //   this._SfSearchSelectContainer.querySelector('#search-' + i).addEventListener('click', () => {
      //   //  console.log('id', ev.currentTarget.id)
      //     this.dispatchMyEvent("valueChanged", {newValue: {}, newText: {}});
      //   });

      // }

      (this._SfSearchSelectContainer as HTMLDivElement).querySelector('#button-next-cursor')?.addEventListener('click', () => {
        this.clickTableNextList(cursor);
      });

    } else if(values.length > 0 && this.nextCursor.length > 0) {

      this._SfSearchSelectContainer.querySelector('#select-list-table').insertAdjacentHTML('beforeend', this.renderListRows(values, multiSelect))
      this._SfSearchSelectContainer.querySelector('#page-num').innerHTML = '&nbsp;&nbsp;'+(this.prevCursor.length+1) + "/" + (Math.ceil(parseInt(found)/this.blockSize))+'&nbsp;&nbsp;';

      if(values.length < this.blockSize) { 
        ((this._SfSearchSelectContainer as HTMLDivElement).querySelector('#down-indicator') as HTMLDivElement).style.display = 'none';
      }

      const inputElements = (this._SfSearchSelectContainer as HTMLDivElement).querySelectorAll('.search-select-input') as NodeListOf<HTMLInputElement>;

      for(var i = 0; i < inputElements.length; i++) {

        (inputElements[i] as HTMLInputElement).addEventListener('click', () => {
          //console.log('event', (ev.currentTarget as HTMLInputElement).id);
          this.dispatchMyEvent("valueChanged", {newValue: {}, newText: {}});
        })

      }

      var old_element = (this._SfSearchSelectContainer as HTMLDivElement).querySelector('#button-next-cursor');
      var new_element = old_element!.cloneNode(true);
      old_element?.parentElement?.replaceChild(new_element, old_element!);
      (this._SfSearchSelectContainer as HTMLDivElement).querySelector('#button-next-cursor')?.addEventListener('click', () => {
        this.clickTableNextList(cursor);
      });
      
    } else {

      html += '<h3>No Records Found</h3>'
      this._SfSearchSelectContainer.innerHTML = html;

    }

  }

  renderLogs = (values: any) => {

    console.log('values', values);

    let html = '';

    if(values.length > 0) {

      html += '<h3 class="left-sticky">Logs Results ('+values.length+')</h3>'
      
      for(var i = (values.length-1); i >= 0 ; i--) {

        console.log('timestamp', (new Date(values[i].timestamp)));

        html += '<table class="left-sticky">';
        html += '<tr>';
        html += '<td>';
        html += '<div><button part="button-icon-small" id="button-collapse-'+i+'" class="material-icons gone button-icon-small">expand_less</button><button part="button-icon-small" id="button-expand-'+i+'" class="material-icons button-icon-small">expand_more</button></div>';
        html += '</td>';
        html += '<td>';
        html += '<div id="search-'+i+'"><strong>' + values[i].message.op + '</strong></div>';
        html += '</td>';
        html += '<td>';
        html += '<div>&nbsp;<strong>' + values[i].message.httpCode + '</strong></div>';
        html += '</td>';
        html += '<td>';
        html += '<div>&nbsp;' + values[i].message.userId+ '</div>';
        html += '</td>';
        html += '<td>';
        html += '<div>&nbsp;' + (new Date(values[i].timestamp) + "").split(' (')[0] + '</div>';
        html += '</td>';
        html += '</tr>';
        html += '</table>';

        html += '<table>';
        html += '<tr>';
        html += '<td>';
        html += '<div id="row-expand-'+i+'" class="gone">';

        if(values[i].message.delta != null) {

          const jsonDelta = (values[i].message.delta);
          console.log("delta",jsonDelta);
          html += '<div><strong>Delta</strong></div>'
          html += '<table>';
          html += '<thead>';
          for(var j = 0; j < jsonDelta.length; j++) {
            if(jsonDelta[j].oldValue == jsonDelta[j].newValue) {
              html += '<th class="td-head">';
            } else {
              html += '<th class="td-highlight">';
            }
            html += jsonDelta[j].field;
            html += '</th>';
          }
          html += '</thead>';
          html += '<tr>';
          for(var j = 0; j < jsonDelta.length; j++) {
            if(jsonDelta[j].oldValue == jsonDelta[j].newValue) {
              html += '<td class="td-dark">';
            } else {
              html += '<td class="td-highlight">';
            }
            html += jsonDelta[j].oldValue;
            html += '</td>';
          }
          html += '</tr>';
          html += '<tr>';
          for(var j = 0; j < jsonDelta.length; j++) {
            if(jsonDelta[j].oldValue == jsonDelta[j].newValue) {
              html += '<td class="td-light">';
            } else {
              html += '<td class="td-highlight">';
            }
            html += jsonDelta[j].newValue;
            html += '</td>';
          }
          html += '</tr>';
          html += '</table>';

        }

        const req = JSON.parse(values[i].message.req.body).values;

        if(req != null) {

          html += '<div><strong>Request</strong></div>'

          html += '<table>';
          html += '<thead>';

          for(var j = 0; j < Object.keys(req).length; j++) {
            html += '<th class="td-head">';
            html += Object.keys(req)[j];
            html += '</th>';
          }
          html += '</thead>';
          html += '<tr>';

          for(var j = 0; j < Object.keys(req).length; j++) {
            html += '<td class="td-light">';
            html += req[Object.keys(req)[j]].value;
            html += '</td>';
          }
          html += '</tr>';
          html += '</table>';

        } else {
          html += '<strong>Request</strong> - ' + JSON.stringify(values[i].message.req.body) + '<br />';
        }
        
        html += '<strong>Response</strong> - ' + JSON.stringify(values[i].message.resp.body) + '';
        html += '</div>';
        html += '</td>';
        html += '</tr>';
        html += '</table>';

      }
      this._SfLogsListContainer.innerHTML = html;

      for(var i = 0; i < values.length; i++) {

        this._SfLogsListContainer.querySelector('#button-expand-'+i).addEventListener('click', (ev: any) => {
          const id = (ev.currentTarget as HTMLElement).id;
          this._SfLogsListContainer.querySelector('#row-expand-'+id.split('-')[2]).style.display = 'block';
          this._SfLogsListContainer.querySelector('#button-collapse-'+id.split('-')[2]).style.display = 'block';
          this._SfLogsListContainer.querySelector('#button-expand-'+id.split('-')[2]).style.display = 'none';
        });

        this._SfLogsListContainer.querySelector('#button-collapse-'+i).addEventListener('click', (ev: any) => {
          const id = (ev.currentTarget as HTMLElement).id;
          this._SfLogsListContainer.querySelector('#row-expand-'+id.split('-')[2]).style.display = 'none';
          this._SfLogsListContainer.querySelector('#button-collapse-'+id.split('-')[2]).style.display = 'none';
          this._SfLogsListContainer.querySelector('#button-expand-'+id.split('-')[2]).style.display = 'block';
        });

      }

    } else {

      html += '<h3>No Records Found</h3>'
      this._SfLogsListContainer.innerHTML = html;

    }

  }

  renderLatestListRows = (values: any) => {

    console.log('renderlatestlistrows', values);

    var html = '';

    for(var i = 0; i < values.length; i++) {

      
      const cols = JSON.parse(values[i].fields.cols);

      // console.log(JSON.parse(values[i].fields.data));
      let data = JSON.parse(values[i].fields.data);
      // let data = Object.values(values[i]);
      // let cols = Object.keys(values[i]);
      // console.log('data', data, cols);

      var classBg = "";

      if(i%2 === 0) {
        classBg = 'td-light';
      } else {
        classBg = 'td-dark';
      }


      html += '<tr>';
      
      for(let j = 0; j < cols.length; j++) {

       

        if(!this.getIgnoreProjections().includes(cols[j])) {

          html += '<td part="td-body" class="td-body '+classBg+'">';
          html += ('<div part="row-col-title">'+cols[j]+'</div>')
          let txt = ""
          if(Array.isArray(data[j])) {
            if(data[j] != null && Util.isJsonString(data[j] as string) && JSON.parse(data[j] as string)['key'] != null && JSON.parse(data[j] as string)['ext'] != null) {
              txt += 'files['+(data[j] as Array<any>).length+']'
            } else {
              for(var k = 0; k < (data[j] as Array<string>).length; k++) {
                
                txt += (data[j] as Array<string>)[k];
                if(k < ((data[j] as Array<string>).length - 1)) {
                  txt += " &nbsp; ";
                }
              }
            }

          } else {
            if(data[j] != null && Util.isJsonString(data[j] as string) && JSON.parse(data[j] as string)[0]['key'] != null && JSON.parse(data[j] as string)[0]['ext'] != null) {
              txt += 'files['+(JSON.parse(data[j] as string)).length+']'
            } else {
              txt += (Util.isJsonString((data[j] as string) ?? "") ? JSON.parse((data[j] as string)) : ((data[j] as string) ?? "undef"))
            }
          }
          html +=  '<sf-i-elastic-text text="'+txt+'" minLength="50" lineSize="5"></sf-i-elastic-text>';
          html += '</td>';

        }

      }
      html += '</tr>';

    }

    return html;

  }

  renderLatest = (values: any) => {

    console.log('values', values);

    let html = '';

    if(values.length > 0) {

      html += '<h3 part="latest-title">'+this.titleMessage+'</h3>'

      html += '<table part="latest-list-table" id="latest-list-table">';

      html += this.renderLatestListRows(values);
      
      html += '</table>';
      this._SfLatestListContainer.innerHTML = html;

    } else {
      if(this.noLatestMessage != ""){
        html += `<h3 part="latest-title">${this.titleMessage}</h3>`
        html += `<h3 part="no-latest-title">${this.noLatestMessage}</h3>`
      }
      this._SfLatestListContainer.innerHTML = html;

    }

  }
  
  renderMastersSearch = (values: any) => {

    console.log('rendering search values', values);
    if(values.categories != null){
      let html = `<option value="noselect" disable="" hidden="">Select</option>`
      for(let categoryid of Object.keys(values.categories)){
        html += `<option value="${categoryid}" >${values.categories[categoryid]}</option>`
      }
      (this._SfSearchFiltersContainer.querySelector('#search-category') as HTMLElement).innerHTML = html
    }
    if(values.priorities != null){
      let html = `<option value="noselect" disable="" hidden="">Select</option>`
      for(let priorityid of Object.keys(values.priorities)){
        html += `<option value="${priorityid}" >${values.priorities[priorityid]}</option>`
      }
      (this._SfSearchFiltersContainer.querySelector('#search-priority') as HTMLElement).innerHTML = html
    }
    if(values.statuses != null){
      let html = `<option value="noselect" disable="" hidden="">Select</option>`
      for(let statusid of Object.keys(values.statuses)){
        html += `<option value="${statusid}" >${values.statuses[statusid]}</option>`
      }
      (this._SfSearchFiltersContainer.querySelector('#search-status') as HTMLElement).innerHTML = html
    }

    this.populateSearchFilterValues()
  }

  renderMasters = async (values: any) => {

    console.log('values', values);
    if(values.categories != null){
      let html = `<option value="noselect" disable="" hidden="">Select</option>`
      for(let categoryid of Object.keys(values.categories)){
        html += `<option value="${categoryid}" >${values.categories[categoryid]}</option>`
      }
      (this._sfSlottedForm[0].querySelector('#sf-i-category') as HTMLElement).innerHTML = html
    }
    if(values.priorities != null){
      let html = `<option value="noselect" disable="" hidden="">Select</option>`
      for(let priorityid of Object.keys(values.priorities)){
        html += `<option value="${priorityid}" >${values.priorities[priorityid]}</option>`
      }
      (this._sfSlottedForm[0].querySelector('#sf-i-priority') as HTMLElement).innerHTML = html
    }
    if(values.statuses != null){
      let html = `<option value="noselect" disable="" hidden="">Select</option>`
      for(let statusid of Object.keys(values.statuses)){
        html += `<option value="${statusid}" >${values.statuses[statusid]}</option>`
      }
      (this._sfSlottedForm[0].querySelector('#sf-i-status') as HTMLElement).innerHTML = html
    }

    if(this.mode == "new"){
      this.processUnitFiltersNew()
    }
    return;
  }

  // renderClipboard = (value: any) => {

  //   var sValues = '';

  //   console.log('fields', this.getFields().length);
  //   for(var i = 0; i < this.getFields().length; i++) {
  //     if(value[this.getFields()[i]] == null) {
  //       this.setError('Error in copy paste!');
  //       setTimeout(() => { this.clearMessages() }, 3000);
  //       return;
  //     }
  //   }

  //   sValues += '[';
  //   for(var i = 0; i < this.getFields().length; i++) {

  //     console.log('fields', i, value[this.getFields()[i]]);

  //     if(value[this.getFields()[i]] != null && Array.isArray(value[this.getFields()[i]]['value'])) {

  //       sValues += '[';

  //       for(var j = 0; j < value[this.getFields()[i]]['value'].length; j++) {

          
  //         if(value[this.getFields()[i]]['value'][j]['key'] != null && value[this.getFields()[i]]['value'][j]['ext'] != null){
  //           sValues += JSON.stringify(value[this.getFields()[i]]['value'][j]);
  //         }else{
  //           sValues += '"';
  //           sValues += value[this.getFields()[i]]['value'][j];
  //           sValues += '"';
  //         }
  //         sValues += ',';
  //         //data[j][0] != null && Util.isJsonString(data[j][0]) && JSON.parse(data[j][0])['key'] != null && JSON.parse(data[j][0])['ext'] != null
  //         console.log('fields insrting 1', value[this.getFields()[i]]['value'][j]);

  //       }

  //       sValues = sValues.replace(/(^,)|(,$)/g, "")
  //       sValues += '],';

  //     } else {


  //       console.log('fields insrting', value[this.getFields()[i]]['value']);

  //       //sValues += '"';
  //       sValues += value[this.getFields()[i]] != null ? '"' + value[this.getFields()[i]]['value'].replace(/\n/g,'\\n') + '"' : '""';
  //       //sValues += '",';
  //       sValues += ',';

  //     }

  //   }
  //   sValues = sValues.replace(/(^,)|(,$)/g, "")
  //   sValues += ']';

  //   console.log('selected values', sValues);

  //   this.selectedViewToDetailValues = (sValues);

  // }

  renderDetail = (value: any) => {

    var sValues = '';

    console.log('selected fields', this.getFields().length);

    sValues += '[';
    for(var i = 0; i < this.getFields().length; i++) {
      if(this.getFields()[i] == "comments"){
        sValues += '[';
        for(var j = 0; j < value[this.getFields()[i]].length; j ++){
          sValues += JSON.stringify(value[this.getFields()[i]][j]['attachment']);
          console.log('selected added object', sValues)
          sValues += ","  
        }
      }
      console.log('selected fields', i, value[this.getFields()[i]]);

      if(value[this.getFields()[i]] != null && Util.isJsonString(value[this.getFields()[i]]) && Array.isArray(JSON.parse(value[this.getFields()[i]]))) {

        sValues += '[';

        for(var j = 0; j < JSON.parse(value[this.getFields()[i]]).length; j++) {
          console.log("selected adding object", JSON.parse(value[this.getFields()[i]])[j], typeof JSON.parse(value[this.getFields()[i]])[j])
          if(typeof JSON.parse(value[this.getFields()[i]])[j] == "object"){
            sValues += JSON.stringify(JSON.parse(value[this.getFields()[i]])[j]);
            console.log('selected added object', sValues)
            sValues += ","  
          }else{
            sValues += '"';
            sValues += JSON.parse(value[this.getFields()[i]])[j];
            sValues += '",';
          }
          
        }

        sValues = sValues.replace(/(^,)|(,$)/g, "")
        sValues += '],';

      } else {

        //sValues += '"';
        sValues += value[this.getFields()[i]] != null ? value[this.getFields()[i]]['value'][0] : '""';
        //sValues += '",';
        sValues += ',';

      }

    }
    sValues = sValues.replace(/(^,)|(,$)/g, "")
    sValues += ']';

    console.log('selected values', sValues, value);

    this.selectedViewToDetailValues = sValues;
    

  }

  renderSearchMultiselect = (values:  Array<any>) => {

    var html = '';

    html += '<option value="noselect">Select</option>';

    for(var i = 0; i < values.length; i++) {

      const id = values[i].id;
      const cols = JSON.parse(values[i].fields.cols[0]) as Array<any>;
      const data = JSON.parse(values[i].fields.data[0]) as Array<any>;

      let selectProjectionValue = "";
      let selectAnotherProjectionValue = "";

      for(var j = 0; j < cols.length; j++) {
        if(cols[j] == this.selectProjection) {
          selectProjectionValue = Array.isArray(data[j]) ? data[j][0] : data[j];
        }
        if(this.selectAnotherProjection != null && this.selectAnotherProjection.length > 0) {
          if(cols[j] == this.selectAnotherProjection) {
            selectAnotherProjectionValue = Array.isArray(data[j]) ? data[j][0] : data[j];
          }
        }
      }

      if(this.selectAnotherProjection != null && selectAnotherProjectionValue.length > 0) {
        html += '<option value="'+selectProjectionValue+';'+id+';'+selectAnotherProjectionValue+'">'+selectProjectionValue+'</option>';
      } else {
        html += '<option value="'+selectProjectionValue+';'+id+'">'+selectProjectionValue+'</option>';
      }

    }

    (this._SfSearchMultiselectSelect as HTMLSelectElement)!.innerHTML = html;

  }
  getSearchFilter = () => {
    let retArr: Record<any,any> = {}
    if(this.isAdmin()){
      for(let searchFilterId of this.searchFilterIds){
        // console.log('search field', searchFilterId, (this._SfSearchFiltersContainer as HTMLElement).querySelector("#"+searchFilterId)?.tagName)
        let value = {};  
        if ((this._SfSearchFiltersContainer.querySelector('#' + searchFilterId) as HTMLElement).tagName.toLowerCase() == "sf-i-form") {
          if((this._SfSearchFiltersContainer.querySelector('#' + searchFilterId) as HTMLElement).style.display != "none") {
            value = {
              type: "sf-i-form",
              value: (this._SfSearchFiltersContainer.querySelector('#' + searchFilterId) as SfIForm).selectedValues(),
              text: (this._SfSearchFiltersContainer.querySelector('#' + searchFilterId) as SfIForm).selectedTexts()  
            }
          }
        } else if ((this._SfSearchFiltersContainer.querySelector('#' + searchFilterId) as HTMLElement).tagName.toLowerCase() == "select") {
          if((this._SfSearchFiltersContainer.querySelector('#' + searchFilterId) as HTMLElement).style.display != "none") {
            value = {
              type: "select",
              value: (this._SfSearchFiltersContainer.querySelector('#' + searchFilterId) as HTMLSelectElement).value,
              text: (this._SfSearchFiltersContainer.querySelector('#' + searchFilterId) as HTMLSelectElement).options[(this._SfSearchFiltersContainer.querySelector('#' + searchFilterId) as HTMLSelectElement).selectedIndex].text
            }
          }
        }
        
        console.log('search filter value', value)
        retArr[searchFilterId] = value
      } 
    }else{
      retArr['search-initiator'] =
        {
          type: "sf-i-form",
          value: [this.userid],
          text: ''
        }
      retArr['search-assignedto'] =
        {
          type: "sf-i-form",
          value: [this.userid],
          text: ''
        }
    }
    return retArr
  }

  fetchSearch = async (cursor: any = "") => {

    this.clearMessages();
    let values = this.getSearchFilter()
    let startDate = (this._SfSearchStartDate as HTMLInputElement).value
    let endDate = (this._SfSearchEndDate as HTMLInputElement).value
    let startTime = new Date(startDate).getTime()
    let endTime = (new Date(endDate).getTime()) + 1000
    const body: any = {"starttime": startTime + "","endtime": endTime + "", "filters":values, "cursor":cursor}
    this.searchParams = body
    console.log('search params',JSON.stringify(body))
    // const body: any = {"searchstring": this._sfInputSearch != null ? this._sfInputSearch.value : "", "cursor": cursor};
    let url = "https://"+this.apiId+"/listbyfilters";

    const authorization = btoa(Util.readCookie('email') + ":" + Util.readCookie('accessToken'));
    const xhr : any = (await this.prepareXhr(body, url, this._SfLoader, authorization)) as any;
    this._SfLoader.innerHTML = '';
    if(xhr.status == 200) {
      const jsonRespose = JSON.parse(xhr.responseText);
      console.log(jsonRespose);
      this.renderSearch(jsonRespose.data);
      
    } else {
      const jsonRespose = JSON.parse(xhr.responseText);
      this.setError(jsonRespose.error);
    }

  }

  fetchSearchMultiselect = async (cursor: any = "") => {

    this.clearMessages();

    const body: any = {"searchstring": (this._SfSearchMultiselectInput as HTMLInputElement).value + "&" + this.searchPhrase, "cursor": cursor};
    let url = "https://"+this.apiId+"/list";

    const authorization = btoa(Util.readCookie('email') + ":" + Util.readCookie('accessToken'));
    const xhr : any = (await this.prepareXhr(body, url, this._SfLoader, authorization)) as any;
    this._SfLoader.innerHTML = '';
    if(xhr.status == 200) {
      const jsonRespose = JSON.parse(xhr.responseText);
      console.log('multiselected', jsonRespose);
      this.renderSearchMultiselect(jsonRespose.values as Array<any>);
      //this.renderSearch(jsonRespose.values, jsonRespose.found, jsonRespose.cursor);
      
    } else {
      const jsonRespose = JSON.parse(xhr.responseText);
      this.setError(jsonRespose.error);
    }

  }

  fetchSearchSelect = async (cursor: any = "") => {

    const body: any = {"searchstring": this.searchPhrase != null ? this.searchPhrase : "", "cursor": cursor};
    console.log(body);
    let url = "https://"+this.apiId+"/list";

    console.log('fetchsearchselect searchphrase', this.searchPhrase);

    if(this.searchPhrase != null) {

      console.log('fetchsearchselect', body);

      const authorization = btoa(Util.readCookie('email') + ":" + Util.readCookie('accessToken'));
      const xhr : any = (await this.prepareXhr(body, url, this._SfLoader, authorization)) as any;
      this._SfLoader.innerHTML = '';
      if(xhr.status == 200) {
        const jsonRespose = JSON.parse(xhr.responseText);
        console.log('fetchsearchselect', jsonRespose);
        console.log(jsonRespose);
        if(this.mode == "select" ) {
          //this.renderSelect(jsonRespose.values);
          this.renderList(jsonRespose.values, jsonRespose.found, jsonRespose.cursor, false);
        } else if(this.mode == "list") {
          this.renderList(jsonRespose.values, jsonRespose.found, jsonRespose.cursor, true);
        }
      } else {
        // const jsonRespose = JSON.parse(xhr.responseText);
        // this.setError(jsonRespose.error);
      }

    }

  }

  fetchSearchList = async (cursor: any = "") => {

    const body: any = {"searchstring": this.searchPhrase, "cursor": cursor};
    let url = "https://"+this.apiId+"/list";

    const authorization = btoa(Util.readCookie('email') + ":" + Util.readCookie('accessToken'));
    const xhr : any = (await this.prepareXhr(body, url, this._SfLoader, authorization)) as any;
    this._SfLoader.innerHTML = '';
    if(xhr.status == 200) {
      const jsonRespose = JSON.parse(xhr.responseText);
      console.log(jsonRespose);
      this.renderList(jsonRespose.values, jsonRespose.found, jsonRespose.cursor);
    } else {
      const jsonRespose = JSON.parse(xhr.responseText);
      this.setError(jsonRespose.error);
    }

  }

  fetchDetail = async () => {

    const body: any = {"id": this.selectedId,"projectid": this.selectedProjectId};
    console.log('fetch details body:', body)
    let url = "https://"+this.apiId+"/detail";

    const authorization = btoa(Util.readCookie('email') + ":" + Util.readCookie('accessToken'));
    const xhr : any = (await this.prepareXhr(body, url, this._SfLoader, authorization)) as any;
    this._SfLoader.innerHTML = '';
    if(xhr.status == 200) {
      console.log('details response', xhr.responseText)
      const jsonRespose = JSON.parse(xhr.responseText);
      console.log('detail', jsonRespose);
      if(this.mode == "text") {
        return jsonRespose.data.value[this.projectField].replace(/"/g, '');
      } else {
        this.selectedTicketDetails = jsonRespose.data
        // this.renderDetail(jsonRespose.data);
      }
    } else {
      const jsonRespose = JSON.parse(xhr.responseText);
      this.setError(jsonRespose.error);
    }

    return null;

  }

  fetchLogs = async () => {
    let startDate = (this._SfInputStartDate as HTMLInputElement).value
    let endDate = (this._SfInputEndDate as HTMLInputElement).value
    let startTime = new Date(startDate).getTime()
    let endTime = (new Date(endDate).getTime()) + 1000
    const body: any = {"starttime": startTime + "","endtime": endTime + ""}
    console.log(body)
    let url = "https://"+this.apiId+"/logs";
    const authorization = btoa(Util.readCookie('email') + ":" + Util.readCookie('accessToken'));
    const xhr : any = (await this.prepareXhr(body, url, this._SfLoader, authorization)) as any;
    this._SfLoader.innerHTML = '';
    if(xhr.status == 200) {
      const jsonRespose = JSON.parse(xhr.responseText);
      console.log(jsonRespose);
      this.renderLogs(jsonRespose.data);
      
    } else {
      const jsonRespose = JSON.parse(xhr.responseText);
      this.setError(jsonRespose.error);
    }

  }

  fetchLatest = async () => {
    let endTime = new Date().getTime()
    let startTime = endTime - (this.latestDaysBlock * 24 * 60 * 60 * 1000)
    const body: any = {"starttime": startTime + "","endtime": endTime + ""}
    console.log(body)
    let url = "https://"+this.apiId+"/getlatestlist";
    const authorization = btoa(Util.readCookie('email') + ":" + Util.readCookie('accessToken'));
    const xhr : any = (await this.prepareXhr(body, url, this._SfLoader, authorization)) as any;
    this._SfLoader.innerHTML = '';
    if(xhr.status == 200) {
      const jsonRespose = JSON.parse(xhr.responseText);
      console.log(jsonRespose);
      this.renderLatest(jsonRespose.data);
      
    } else {
      const jsonRespose = JSON.parse(xhr.responseText);
      this.setError(jsonRespose.error);
    }

  }

  fetchMasters = async (successCallback:Function) => {
    let endTime = new Date().getTime()
    let startTime = endTime - (this.latestDaysBlock * 24 * 60 * 60 * 1000)
    const body: any = {"starttime": startTime + "","endtime": endTime + ""}
    console.log(body)
    let url = "https://"+this.apiId+"/getmasters";
    const authorization = btoa(Util.readCookie('email') + ":" + Util.readCookie('accessToken'));
    const xhr : any = (await this.prepareXhr(body, url, this._SfLoader, authorization)) as any;
    this._SfLoader.innerHTML = '';
    if(xhr.status == 200) {
      const jsonRespose = JSON.parse(xhr.responseText);
      console.log("masters",jsonRespose);
      await successCallback(jsonRespose.data.value);
      
    } else {
      const jsonRespose = JSON.parse(xhr.responseText);
      this.setError(jsonRespose.error);
    }

  }

  submitDelete = async () => {

    this.clearMessages();

    const body: any = {};
    let url = "";

    body["id"] = this.selectedId;
    url = "https://"+this.apiId+"/delete";

    const authorization = btoa(Util.readCookie('email') + ":" + Util.readCookie('accessToken'));
    const xhr : any = (await this.prepareXhr(body, url, this._SfLoader, authorization)) as any;
    this._SfLoader.innerHTML = '';
    if(xhr.status == 200) {
      this.setSuccess('Operation Successful!');
      setTimeout(() => {
        this.clearMessages();
        this._SfButtonBack.dispatchEvent(new Event('click'));
      }, 2000);
      
    } else {
      const jsonRespose = JSON.parse(xhr.responseText);
      this.setError(jsonRespose.error);
    }

  }

  submitNew = async () => {

    this.clearMessages();

    console.log('submitNew called');

    const body: any = {};
    let url = "https://"+this.apiId+"/create";

    const values: any = {};

    for(var i = 0; i < this.getFields().length; i++) {

      const field = this.getFields()[i] as string;
      
      if(field == "comments"){
        if(values[field] == null){
          values[field] = []
        }
        let content = this.getInputValue('sf-i-comment-content')
        let attachment = this.getInputValue('sf-i-comment-attachment')
        console.log(values[field])
        values[field].push({
          "content":content,
          "attachment":attachment
        })
      }else{
        values[field] = this.getInputValue(this.getInputs()[i])
      }

    }

    body["values"] = values; 
    body["userid"] = this.userid; 
    body["username"] = this.username; 

    console.log(body);
    console.log(JSON.stringify(body));

    const authorization = btoa(Util.readCookie('email') + ":" + Util.readCookie('accessToken'));
    const xhr : any = (await this.prepareXhr(body, url, this._SfLoader, authorization)) as any;
    this._SfLoader.innerHTML = '';
    if(xhr.status == 200) {
      this.setSuccess('Operation Successful!');
      this.clearInputs();
      setTimeout(() => {
        this.clearMessages();
        this._SfButtonBack.click();
      }, 2000);
      
    } else {
      const jsonRespose = JSON.parse(xhr.responseText);
      this.setError(jsonRespose.error);
      setTimeout(() => {
        this.clearMessages();
      }, 2000);
    }

  }

  submitEdit = async () => {

    this.clearMessages();

    console.log('submitEdit called');

    const body: any = {};
    let url = "";

    const values: any = this.populateValues();

    body["values"] = values;
    body["id"] = this.selectedId;
    body["userid"] = this.userid; 
    body["username"] = this.username; 
    url = "https://"+this.apiId+"/update";

    console.log(JSON.stringify(body), url);

    const authorization = btoa(Util.readCookie('email') + ":" + Util.readCookie('accessToken'));
    const xhr : any = (await this.prepareXhr(body, url, this._SfLoader, authorization)) as any;
    this._SfLoader.innerHTML = '';
    if(xhr.status == 200) {
      this.setSuccess('Operation Successful!');
      if(this.mode == "detail") {
        setTimeout(() => {
          this.clearMessages();
          this._SfButtonBack.click();
        }, 2000);
      } else {
        this.dispatchMyEvent("valueChanged", {});
        this.dispatchMyEvent("valueUpdated", {});
        this.loadMode();
      }
      setTimeout(() => {
        this.clearMessages();
      }, 3000);
    } else {
      const jsonRespose = JSON.parse(xhr.responseText);
      this.setError(jsonRespose.error);
    }

  }

  populateValues = () => {
    const values: any = {};

    // for(var i = 0; i < this.getFields().length; i++) {

    //   const field = this.getFields()[i] as string;
    //   console.log('field', field);
    //   values[field] = this.getInputValue(this.getInputs()[i])

    // }
    for(var i = 0; i < this.getFields().length; i++) {

      const field = this.getFields()[i] as string;
      
      if(field == "comments"){
        if(values[field] == null){
          values[field] = this.selectedTicketDetails['comments'] ?? []
        }
        let content = this.getInputValue('sf-i-comment-content')
        let attachment = this.getInputValue('sf-i-comment-attachment')
        console.log(values[field])
        values[field].push({
          "content":content,
          "attachment":attachment
        })
      }else{
        values[field] = this.getInputValue(this.getInputs()[i])
      }

    }
    console.log('copied values', values)
    return values;
  }

  getValidationOfElement = (id: string) => {

    let ret = "";

    for(var i = 0; i < Object.keys(this.getValidations()).length; i++) {

      const key = Object.keys(this.getValidations())[i];
      console.log('key', key);
      if(key == id) {
        return this.getValidations()[id]
      }
    }

    return ret;

  }

  evalSubmit = () => {

    var evaluate = true;

    console.log('inputs', this.getInputs());

    for(var i = 0; i < this.getInputs().length; i++) {

      const id = this.getInputs()[i];
      const element = (this._sfSlottedForm[0].querySelector('#' + id) as HTMLElement);

      if((element as HTMLElement).style.display != "none") {

        if(element.nodeName.toLowerCase() == "sf-i-select") {
          const elementSfISelect = element as SfISelect;
          const parentElement = (elementSfISelect.parentElement as HTMLDivElement);
          const icon = parentElement.querySelector('.error-icon') as HTMLElement;
          if(icon != null) {
            parentElement.removeChild(icon);
          }
          if(element.hasAttribute('mandatory') && (elementSfISelect.selectedValues().length === 0 || elementSfISelect.selectedIndex() === 0)) {
            const errorHtml = '<div class="error-icon d-flex justify-end color-error"><div class="material-symbols-outlined">exclamation</div></div>';
            parentElement.insertAdjacentHTML('beforeend', errorHtml);
            evaluate = false;
            break;
          } else {
            const errorHtml = '<div class="error-icon d-flex justify-end color-success"><div class="material-icons">done</div></div>';
            parentElement.insertAdjacentHTML('beforeend', errorHtml);
          }
        } else if(element.nodeName.toLowerCase() == "sf-i-sub-select") {
          const elementSfISubSelect = element as SfISubSelect;
          const parentElement = (elementSfISubSelect.parentElement as HTMLDivElement);
          const icon = parentElement.querySelector('.error-icon') as HTMLElement;
          if(icon != null) {
            parentElement.removeChild(icon);
          }
          if(element.hasAttribute('mandatory') && (elementSfISubSelect.selectedValues().length === 0 || elementSfISubSelect.selectedIndex() === 0)) {
            const errorHtml = '<div class="error-icon d-flex justify-end color-error"><div class="material-symbols-outlined">exclamation</div></div>';
            parentElement.insertAdjacentHTML('beforeend', errorHtml);
            evaluate = false;
            break;
          } else if(elementSfISubSelect.style.display != "none") {
            const errorHtml = '<div class="error-icon d-flex justify-end color-success"><div class="material-icons">done</div></div>';
            parentElement.insertAdjacentHTML('beforeend', errorHtml);
          }
        } else if(element.nodeName.toLowerCase() == "sf-i-form") {
          const elementSfIForm = element as SfIForm;
          const parentElement = ((elementSfIForm as SfIForm).parentElement as HTMLDivElement);
          const icon = parentElement.querySelector('.error-icon') as HTMLElement;
          if(icon != null) {
            parentElement.removeChild(icon);
          }
          if(elementSfIForm.mode == "list") {
  
            console.log('form selected values', elementSfIForm.selectedValues());
            console.log('form selected texts', elementSfIForm.selectedTexts());
  
            if(element.hasAttribute('mandatory') && elementSfIForm.selectedValues().length === 0) {
              const errorHtml = '<div class="error-icon d-flex justify-end color-error"><div class="material-symbols-outlined">exclamation</div></div>';
            parentElement.insertAdjacentHTML('beforeend', errorHtml);
              console.log('evaluate false return', element)
              evaluate = false;
              break;
            } else {
              const errorHtml = '<div class="error-icon d-flex justify-end color-success"><div class="material-icons">done</div></div>';
            parentElement.insertAdjacentHTML('beforeend', errorHtml);
            }
    
          } else {
  
            if(element.hasAttribute('mandatory') && elementSfIForm.selectedValues().length === 0) {
              const errorHtml = '<div class="error-icon d-flex justify-end color-error"><div class="material-symbols-outlined">exclamation</div></div>';
              parentElement.insertAdjacentHTML('beforeend', errorHtml);
              console.log('evaluate false return', element)
              evaluate = false;
              break;
            } else {
              const errorHtml = '<div class="error-icon d-flex justify-end color-success"><div class="material-icons">done</div></div>';
              parentElement.insertAdjacentHTML('beforeend', errorHtml);
            }
    
          }
          
        }else if(element.nodeName.toLowerCase() == "sf-i-uploader") {
          const elementSfIUploader = element as SfIUploader;
          const parentElement = ((elementSfIUploader as SfIUploader).parentElement as HTMLDivElement);
          const icon = parentElement.querySelector('.error-icon') as HTMLElement;
          if(icon != null) {
            parentElement.removeChild(icon);
          }
          let errInValidation = true
          console.log('elementSfUploader uploadvalid', elementSfIUploader.uploadValid, elementSfIUploader.inputArr.length, element.hasAttribute('mandatory'))
          if(element.hasAttribute('mandatory')){
            if(elementSfIUploader.uploadValid){
              errInValidation = false
            }
            // errInValidation = !(elementSfIUploader.uploadValid || elementSfIUploader.inputArr.length == 0)
          }else{
            if(elementSfIUploader.uploadValid){
              errInValidation = false
            } else if( elementSfIUploader.inputArr.length === 0){
              errInValidation = false
            }
            // errInValidation = !(elementSfIUploader.uploadValid)
          } 
          
          if(errInValidation ) {
            const errorHtml = '<div class="error-icon d-flex justify-end color-error"><div class="material-symbols-outlined">exclamation</div></div>';
            parentElement.insertAdjacentHTML('beforeend', errorHtml);
            console.log('evaluate false return', element)
            evaluate = false;
            break;
          } else {
            const errorHtml = '<div class="error-icon d-flex justify-end color-success"><div class="material-icons">done</div></div>';
            parentElement.insertAdjacentHTML('beforeend', errorHtml);
          }
    
          
          
        } else {
          const parentElement = (element.parentElement as HTMLDivElement);
          const icon = parentElement.querySelector('.error-icon') as HTMLElement;
          if(icon != null) {
            parentElement.removeChild(icon);
          }

          let errInValidation = false;

          console.log('testingvalidate', (element as HTMLInputElement).value, (/\s{2}/.test((element as HTMLInputElement).value)), this.getValidationOfElement(id));

          if(!(/\s{2}/.test((element as HTMLInputElement).value))) {


            if(this.getValidationOfElement(id) == this.VALIDATION_TEXT_BASIC) {

              let value = (element as HTMLInputElement).value;
  
              if((element as HTMLInputElement).value.length > 0 && !(/\s{2}/.test((element as HTMLInputElement).value))) {
  
                if(value.indexOf('[') >= 0 || value.indexOf(']') >= 0) {
                  errInValidation = true;
                }
                if(value.indexOf('"') >= 0) {
                  errInValidation = true;
                }
    
                if(errInValidation) {
                  evaluate = false;
                  const errorHtml = '<div class="error-icon d-flex justify-end color-error"><div class="material-symbols-outlined">exclamation</div></div>';
                  parentElement.insertAdjacentHTML('beforeend', errorHtml);
                  console.log('evaluate false return', element)
                  evaluate = false;
                  return;
                }
    
              }
  
              
            }
  
            if(this.getValidationOfElement(id) == this.VALIDATION_TEXT_DATE) {
  
              let value = (element as HTMLInputElement).value;
  
              if((element as HTMLInputElement).value.length > 0) {
  
                if(value.indexOf(' ') >= 0) {
                  errInValidation = true;
                }
  
                var regExpAlpha = /[a-zA-Z]/g;
                var regExpSpecial = /[ `!@#$%^&()_+\-=\[\]{};':"|.<>?~]/;
  
                if(regExpAlpha.test(value) || regExpSpecial.test(value)) {
                  errInValidation = true;
                }
    
                if(errInValidation) {
                  evaluate = false;
                  const errorHtml = '<div class="error-icon d-flex justify-end color-error"><div class="material-symbols-outlined">exclamation</div></div>';
                  parentElement.insertAdjacentHTML('beforeend', errorHtml);
                  console.log('evaluate false return', element)
                  evaluate = false;
                  return;
                }
    
              }
  
              
            }
            if(this.getValidationOfElement(id) == this.VALIDATION_SELECT) {
  
              let value = (element as HTMLInputElement).value;
  
              if((element as HTMLInputElement).value.length > 0) {
  
                if(value.indexOf('noselect') >= 0) {
                  errInValidation = true;
                }
    
                if(errInValidation) {
                  evaluate = false;
                  const errorHtml = '<div class="error-icon d-flex justify-end color-error"><div class="material-symbols-outlined">exclamation</div></div>';
                  parentElement.insertAdjacentHTML('beforeend', errorHtml);
                  console.log('evaluate false return', element)
                  evaluate = false;
                  return;
                }
    
              }
  
              
            }
  
          } else {
            const errorHtml = '<div class="error-icon d-flex justify-end color-error"><div class="material-symbols-outlined">exclamation</div></div>';
            parentElement.insertAdjacentHTML('beforeend', errorHtml);
            errInValidation = true;
            evaluate = false;
          }

          if(!errInValidation) {
            if(element.hasAttribute('mandatory') && (element as HTMLInputElement).value.length === 0) {
              const errorHtml = '<div class="error-icon d-flex justify-end color-error"><div class="material-icons">exclamation</div></div>';
              parentElement.insertAdjacentHTML('beforeend', errorHtml);
              console.log('evaluate false return', element, (element as HTMLInputElement).value)
              evaluate = false;
              break;
            } else {
              const errorHtml = '<div class="error-icon d-flex justify-end color-success"><div class="material-icons">check_circle</div></div>';
              parentElement.insertAdjacentHTML('beforeend', errorHtml);
            }
          }

          console.log('getvalidationofelement', id, this.getValidationOfElement(id));

        }

      } else {
        const parentElement = (element.parentElement as HTMLDivElement);
        const icon = parentElement.querySelector('.error-icon') as HTMLElement;
        if(icon != null) {
          parentElement.removeChild(icon);
        }
      }

    }

    console.log('evaluate', evaluate);

    if(evaluate) {
      this._sfButtonSubmit?.removeAttribute('disabled');
    } else {
      this._sfButtonSubmit?.setAttribute('disabled', true);
    }

  }

  disableConfirm = (value: boolean) => {

    if(!value) {
      //(this._sfButtonTrail as HTMLButtonElement).style.display = 'none';
      (this._sfButtonCalendar as HTMLButtonElement).style.display = 'none';
      (this._sfButtonCalendarCancel as HTMLButtonElement).style.display = 'none';
      (this._SfButtonEditCancel as HTMLButtonElement).style.display = 'none';
      (this._SfButtonEdit as HTMLButtonElement).style.display = 'none';
      (this._sfButtonSubmit as HTMLButtonElement).style.display = 'none';
    } else {
      this.disableEdit(true);
    }

  }

  disableCalendar = (value: boolean) => {

    if(value) {
      (this._sfButtonCalendar as HTMLButtonElement).style.display = 'block';
      (this._sfButtonCalendarCancel as HTMLButtonElement).style.display = 'none';
      (this._SfButtonEditCancel as HTMLButtonElement).style.display = 'none';
      (this._SfButtonEdit as HTMLButtonElement).style.display = 'block';
      (this._sfButtonSubmit as HTMLButtonElement).style.display = 'none';
      (this._SfCalendarContainer as HTMLDivElement).style.display = 'none';
      (this._SfFormContainer as HTMLDivElement).style.display = 'block';
      
    } else {
      (this._sfButtonCalendar as HTMLButtonElement).style.display = 'none';
      (this._sfButtonCalendarCancel as HTMLButtonElement).style.display = 'block';
      (this._SfButtonEditCancel as HTMLButtonElement).style.display = 'none';
      (this._SfButtonEdit as HTMLButtonElement).style.display = 'none';
      (this._sfButtonSubmit as HTMLButtonElement).style.display = 'none';
      (this._SfCalendarContainer as HTMLDivElement).style.display = 'block';
      (this._SfFormContainer as HTMLDivElement).style.display = 'none';
    }

  }

  disableEdit = (value: boolean) => {
    console.log("disabling edits", value)
    if(value) {
      if(this.apiIdCalendarDetail != "") {
        (this._sfButtonCalendar as HTMLButtonElement).style.display = 'block';
        (this._sfButtonCalendarCancel as HTMLButtonElement).style.display = 'none';
      }
      (this._SfButtonEditCancel as HTMLButtonElement).style.display = 'none';
      (this._SfButtonEdit as HTMLButtonElement).style.display = 'block';
      (this._sfSlottedForm[0].querySelector("#new-comment-container") as HTMLDivElement).style.display = 'none';
      
      (this._sfButtonSubmit as HTMLButtonElement).style.display = 'none';
    } else {
      // (this._sfButtonTrail as HTMLButtonElement).style.display = 'none';
      if(this.apiIdCalendarDetail != "") {
        (this._sfButtonCalendar as HTMLButtonElement).style.display = 'none';
        (this._sfButtonCalendarCancel as HTMLButtonElement).style.display = 'none';
      }
      (this._SfButtonEditCancel as HTMLButtonElement).style.display = 'block';
      (this._SfButtonEdit as HTMLButtonElement).style.display = 'none';
      (this._sfButtonSubmit as HTMLButtonElement).style.display = 'block';
      (this._sfSlottedForm[0].querySelector("#new-comment-container") as HTMLDivElement).style.display = 'block';
      console.log('ticketing mode', this.mode, this.isAdmin())
      if(this.mode != "new" || !this.isAdmin()){
        (this._sfSlottedForm[0].querySelector("#sf-i-project") as SfIForm).flow = 'read';
        (this._sfSlottedForm[0].querySelector("#sf-i-initiator") as SfIForm).flow = 'read';
      }else{
        (this._sfSlottedForm[0].querySelector("#sf-i-project") as SfIForm).flow = '';
        (this._sfSlottedForm[0].querySelector("#sf-i-initiator") as SfIForm).flow = '';
      }
      if(!this.isAdmin()){
        (this._sfSlottedForm[0].querySelector("#sf-i-assignedto") as SfIForm).flow = 'read';
        // (this._sfSlottedForm[0].querySelector("#sf-i-assignedto") as SfIForm).loadMode();
      }
      // (this._sfSlottedForm[0].querySelector("#sf-i-project") as SfIForm).loadMode();
      // (this._sfSlottedForm[0].querySelector("#sf-i-initiator") as SfIForm).loadMode();
      
    }

    this.processFiltersByEvent();

  }

  hideDelete = () => {
    (this._SfButtonDelete as HTMLButtonElement).style.display = 'none';
  }

  hideBack = () => {
    (this._SfButtonBack as HTMLButtonElement).style.visibility = 'hidden';
  }

  formatShortlistedSearchPhrase = () => {

    var searchStr = "";

    for(var i = 0; i < Object.keys(this.shortlistedSearchPhrases).length; i++) {
      searchStr += (this.shortlistedSearchPhrases[Object.keys(this.shortlistedSearchPhrases)[i]])
      if(i < (Object.keys(this.shortlistedSearchPhrases).length - 1)) {
        searchStr += '&'
      }
    }

    this.searchPhrase = searchStr;

  }

  updateShortlistedSearchPhrase = (parents: any, childElement: any) => {

    for(var k = 0; k < parents.length; k++) {

      const parentElement = (this._sfSlottedForm[0].querySelector('#' + parents[k]) as HTMLElement);
      if(parentElement.nodeName.toLowerCase() == "sf-i-select") {

        var selText = '';
        for(var l = 0; l < (parentElement as SfISelect).selectedTexts().length; l++) {
          selText += (parentElement as SfISelect).selectedTexts()[l]
          if(l < ((parentElement as SfISelect).selectedTexts().length - 1)) {
            selText += '&'
          }
        }
        childElement.shortlistedSearchPhrases[parentElement.id] = selText

      } else if(parentElement.nodeName.toLowerCase() == "sf-i-sub-select") {

        var selText = '';
        for(var l = 0; l < (parentElement as SfISubSelect).selectedTexts().length; l++) {
          selText += (parentElement as SfISubSelect).selectedTexts()[l]
          if(l < ((parentElement as SfISubSelect).selectedTexts().length - 1)) {
            selText += '&'
          }
        }
        childElement.shortlistedSearchPhrases[parentElement.id] = selText

      } else if(parentElement.nodeName.toLowerCase() == "sf-i-form") {

        var selText = '';
        for(var l = 0; l < (parentElement as SfISubSelect).selectedTexts().length; l++) {
          selText += (parentElement as SfISubSelect).selectedTexts()[l]
          if(l < ((parentElement as SfISubSelect).selectedTexts().length - 1)) {
            selText += '&'
          }
        }
        childElement.shortlistedSearchPhrases[parentElement.id] = selText

      } else if(parentElement.nodeName.toLowerCase() == "input" || parentElement.nodeName.toLowerCase() == "textarea") {

        var selText = '';
        selText += (parentElement as HTMLInputElement).value + "&"
        childElement.shortlistedSearchPhrases[parentElement.id] = selText

      }

    }
    childElement.formatShortlistedSearchPhrase();
    childElement.loadMode();

  }

  processDependencies = () => {

    for(var i = 0; i < this.getDependencies().length; i++) {
      
      const type = this.getDependencies()[i].type;

      if(type == "searchable") {

        const parents = this.getDependencies()[i].parents;
        const child = this.getDependencies()[i].child;
        const childElement = (this._sfSlottedForm[0].querySelector('#' + child) as SfIForm);

        for(var j = 0; j < parents.length; j++) {

          const parent = parents[j];
          const parentElement = (this._sfSlottedForm[0].querySelector('#' + parent) as HTMLElement);

          if(parentElement.nodeName.toLowerCase() == "sf-i-form" || parentElement.nodeName.toLowerCase() == "sf-i-select" || parentElement.nodeName.toLowerCase() == "sf-i-sub-select") {

            parentElement?.addEventListener('valueChanged', () => {
              console.log('value changed', parentElement.nodeName.toLowerCase(), (parentElement as HTMLInputElement).value)
              this.updateShortlistedSearchPhrase(parents, childElement);
            });
  
            parentElement?.addEventListener('renderComplete', () => {
              this.updateShortlistedSearchPhrase(parents, childElement);
            });
  
          } else if(parentElement.nodeName.toLowerCase() == "sf-i-uploader"){
            parentElement?.addEventListener('uploadValid', () => {
              this.updateShortlistedSearchPhrase(parents, childElement);
            })
            // parentElement?.addEventListener('uploadComplete', () => {
            //   console.log('value changed', parentElement.nodeName.toLowerCase(), (parentElement as HTMLInputElement).value)
            //   this.updateShortlistedSearchPhrase(parents, childElement);
            // });
            // parentElement?.addEventListener('analysisCompleted', () => {
            //   console.log('value changed', parentElement.nodeName.toLowerCase(), (parentElement as HTMLInputElement).value)
            //   this.updateShortlistedSearchPhrase(parents, childElement);
            // });
          } else {

            parentElement?.addEventListener('keyup', () => {
              console.log('keyup fired...');
              this.updateShortlistedSearchPhrase(parents, childElement);
            })

            // parentElement?.addEventListener('input', () => {
            //   console.log('input fired...');
            //   this.updateShortlistedSearchPhrase(parents, childElement);
            // })

            // parentElement?.addEventListener('change', () => {
            //   console.log('input fired...');
            //   this.updateShortlistedSearchPhrase(parents, childElement);
            // })

          }

        }

      } else {

        const parent = this.getDependencies()[i].parent;
        const child = this.getDependencies()[i].child;
  
        const parentElement = (this._sfSlottedForm[0].querySelector('#' + parent) as SfISelect);
        const childElement = (this._sfSlottedForm[0].querySelector('#' + child) as SfISubSelect);
  
        parentElement?.addEventListener('valueChanged', (ev: any) => {
          childElement.filterId = ev.detail.newValue;
          childElement.populateList();
        });
  
        childElement.filterId = parentElement.selectedValues()[0];
        childElement.populateList();

      }


    }

  }

  initShowInputs = async () => {

    for(var i = 0; i < this.getInputs().length; i++) {

      console.log("input ids",this.getInputs()[i]);
      
      const element = this._sfSlottedForm[0].querySelector('#' + this.getInputs()[i]);
      const elementLabel = this._sfSlottedForm[0].querySelector('#' + this.getInputs()[i] + '-label');
      if(this.getInputs()[i] == "sf-i-status"){
        if(this.mode == "new"){
          element.style.display = 'none';
          this._sfSlottedForm[0].querySelector('#sf-i-status-container').style.display = 'none'
        }else{
          element.style.display = 'block';
          this._sfSlottedForm[0].querySelector('#sf-i-status-container').style.display = 'block'
        }
      }else if(this.getInputs()[i] == "sf-i-assignedto"){
        if(!this.isAdmin() && this.mode == "new"){
          element.style.display = 'none';
          this._sfSlottedForm[0].querySelector('#sf-i-assignedto-container').style.display = 'none'
        }else{
          element.style.display = 'block';
          this._sfSlottedForm[0].querySelector('#sf-i-assignedto-container').style.display = 'block'
        }
      }else if(this.getInputs()[i] == "sf-i-comments"){
        if(this.mode == "new"){
          element.style.display = 'none';
          elementLabel.style.display = 'none'
          this._sfSlottedForm[0].querySelector('#sf-i-comments-container').style.display = 'none'
        }else{
          element.style.display = 'flex';
          elementLabel.style.display = 'inline'
          this._sfSlottedForm[0].querySelector('#sf-i-comments-container').style.display = 'flex'
        }
      }else{
        element.style.display = 'flex';
      } 
      // element.style.display = 'block';

    }
    await this.fetchMasters(this.renderMasters);

  }

  initDisableInputs = (value: boolean, reload:boolean = true) => {

    for(var i = 0; i < this.getInputs().length; i++) {

      const element = this._sfSlottedForm[0].querySelector('#' + this.getInputs()[i]);
      console.log('disabling', element, value);
      if(element.nodeName.toLowerCase() == "sf-i-select") {
        (element as SfISelect).flow = value ? "read" : "";
        console.log('disabling1', element);
        (element as SfISelect).initState();
      } else if (element.nodeName.toLowerCase() == "sf-i-sub-select") {
        (element as SfISubSelect).flow = value ? "read" : "";
        (element as SfISubSelect).initState();
      } else if (element.nodeName.toLowerCase() == "sf-i-form") {
        console.log('init disabling form', (element as SfIForm).mode);
        let oldFlow = (element as SfIForm).flow; 
        (element as SfIForm).flow = (value || ((this.getInputs()[i] == "sf-i-project" || this.getInputs()[i] == "sf-i-initiator") && (this.mode != "new" || !this.isAdmin())) || (this.getInputs()[i] == "sf-i-assignedto" && !this.isAdmin())) ? "read" : "";
        if(this.getInputs()[i] == "sf-i-assignedto" && this.isAdmin() && (element as SfIForm).flow != "read"){
          (element as SfIForm).enableEditButton = "yes"
        }else{
          (element as SfIForm).enableEditButton = "no"
        }
        if(oldFlow != (element as SfIForm).flow){
          if(reload){
            (element as SfIForm).loadMode();
          }
        }
        console.log('ticketing mode', (value || ((this.getInputs()[i] == "sf-i-project" || this.getInputs()[i] == "sf-i-initiator") && (this.mode != "new" || !this.isAdmin())) || (this.getInputs()[i] == "sf-i-assignedto" && !this.isAdmin())), (element as SfIForm).flow, element);
        //(element as SfITicketing).initState();
      } else if (element.nodeName.toLowerCase() == "sf-i-uploader") {
        
        (element as SfIUploader).readOnly = value;
        (element as SfIUploader).loadMode();
        console.log('init disabling form', (element as SfIUploader).readOnly, value, (element as SfIUploader).prepopulatedInputArr, (element as SfIUploader).current, (element as SfIUploader).mode);
      } else if (this.getInputs()[i] == "sf-i-comments") {
        (this._sfSlottedForm[0].querySelector("#new-comment-container") as HTMLDivElement).style.display = value ? 'none' : 'block'
      } else {
        if(value|| ((this.getInputs()[i] == "sf-i-status" && !this.isAdmin()))) {
          (element as HTMLInputElement).setAttribute('disabled', 'disabled');
        } else {
          (element as HTMLInputElement).removeAttribute('disabled');
        }
        
      }

    }

  }

  clearInputs = () => {

    for(var i = 0; i < this.getInputs().length; i++) {
      
      const element = this._sfSlottedForm[0].querySelector('#' + this.getInputs()[i]);
      console.log('clearing inputs', element)
      if(element.nodeName.toLowerCase() == "sf-i-select") {

        (element as SfISelect).selectedId = [];
        (element as SfISelect).clearSelection();

        // if((element as SfISelect).selectedId == null || (element as SfISelect).selectedId == "") {
        //   (element as SfISelect).clearSelection();
        // }

      } else if (element.nodeName.toLowerCase() == "sf-i-sub-select") {

        (element as SfISubSelect).selectedId = [];
        (element as SfISubSelect).clearSelection();

        // if((element as SfISubSelect).selectedId == null || (element as SfISubSelect).selectedId == "") {
        //   (element as SfISubSelect).clearSelection();
        // }

      } else if (element.nodeName.toLowerCase() == "sf-i-form") {

        (element as SfIForm).selectedSearchId = [];
        (element as SfIForm).clearSelection();
        (element as SfIForm).searchPhrase = "";
        (element as SfIForm).loadMode();

        // if((element as SfITicketing).selectedSearchId == null || (element as SfITicketing).selectedSearchId == "") {
        //   (element as SfITicketing).clearSelection();
        // }
        

      } else if (element.nodeName.toLowerCase() == "sf-i-uploader") {
        console.log('clearing inputs');
        (element as SfIUploader).prepopulatedInputArr = "[]";
        (element as SfIUploader).clearUploads();
        (element as SfIUploader).loadMode();
        console.log('clearing inputs');
        // if((element as SfITicketing).selectedSearchId == null || (element as SfITicketing).selectedSearchId == "") {
        //   (element as SfITicketing).clearSelection();
        // }
        

      } else if (element.nodeName.toLowerCase() == "select") {
        console.log('clearing inputs');
        (element as HTMLSelectElement).value = "noselect";
        
      } else {

        (element as HTMLInputElement).value = "";

      }

      if(this.getInputs()[i] == "sf-i-comments"){
        (this._sfSlottedForm[0].querySelector('#sf-i-comment-content') as HTMLInputElement).value = "";
        let attachementUploader = (this._sfSlottedForm[0].querySelector('#sf-i-comment-attachment') as SfIUploader)
        attachementUploader.prepopulatedInputArr = "[]";
        attachementUploader.clearUploads();
        attachementUploader.loadMode();
      }

    }

  }

  removeItemByValue = (value: string) => {

    if(!this.removedValues.includes(value)) this.removedValues.push(value);

  }

  processFormLayouting = () => {

    for(var i = 0; i < this.getInputs().length; i++) {

      const element = this._sfSlottedForm[0].querySelector('#' + this.getInputs()[i]);

      if(element.nodeName.toLowerCase() == "sf-i-select") {

      } else if (element.nodeName.toLowerCase() == "sf-i-sub-select") {

      } else {

        //(element as HTMLInputElement).style.width = '98%';

      }

    }

    this._sfButtonSubmit.style.width = '100%';

  }

  fWait = (ms: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Done waiting");
        resolve(ms)
      }, ms )
    })
  }  

  checkButtonState = true;

  // triggerCheckButtonStates = async () => {

  //   const func = () => {
  //     console.log('i = func called');
  //     this.checkButtonStates();
  //   }

  //   let myPromise = new Promise((resolve) => {

  //     func();
  //     console.log('i = 20 checkbuttonstate', this.checkButtonState);
  //     if(this.checkButtonState) {
  //       console.log('i = settimeout', this.checkButtonState);
  //       setTimeout(() => {
  //         func();
  //       }, 2000);
  //     } else {
  //       console.log('i = resolving promise', this.checkButtonState);
  //       resolve('')
  //     }
  //   });
    
  //   return myPromise;
  // }

  checkButtonStates = () => {

    this.checkButtonState = false;
    var checkCount = 0;
    var checkTotal = 0;

    if((this._SfFormC[0] as HTMLDivElement) == null) {
      this.checkButtonState = true;
      console.log('i = func checkbuttonstate returning null', this.checkButtonState);
      return;
    }

    console.log('i = func checkbuttonstate no null 10', this.checkButtonState);
    const selects = (this._SfFormC[0] as HTMLDivElement).querySelectorAll('sf-i-select') as NodeListOf<SfISelect>;
    for(var i = 0; i < selects.length; i++) {
      checkTotal++;
      const outerHtml = selects[i].nextElementSibling?.outerHTML;
      if(selects[i].hasAttribute('mandatory')) {
        if(outerHtml != null) {
          if(outerHtml!.indexOf('color-success') >= 0) {
            checkCount++;
          } 
        }
      }
    }

    console.log('i = func checkbuttonstate no null 11', this.checkButtonState);
    if(!this.checkButtonState) {
      const subSelects = (this._SfFormC[0] as HTMLDivElement).querySelectorAll('sf-i-sub-select') as NodeListOf<SfISubSelect>;
      for(var i = 0; i < subSelects.length; i++) {
        checkTotal++;
        const outerHtml = subSelects[i].nextElementSibling?.outerHTML;
        console.log('checkbuttonstate', subSelects[i], subSelects[i].hasAttribute('mandatory'));
        if(subSelects[i].hasAttribute('mandatory')) {
          if(outerHtml != null) {
            if(outerHtml!.indexOf('color-success') >= 0) {
              checkCount++;
            }
          }
        }
      }
    }

    console.log('i = func checkbuttonstate no null 12', this.checkButtonState);
    if(!this.checkButtonState) {
      const subForms = (this._SfFormC[0] as HTMLDivElement).querySelectorAll('sf-i-form') as NodeListOf<SfIForm>;
      for(var i = 0; i < subForms.length; i++) {
        checkTotal++;
        const outerHtml = subForms[i].nextElementSibling?.outerHTML;
        if(subForms[i].hasAttribute('mandatory')) {
          if(outerHtml != null) {
            if(outerHtml!.indexOf('color-success') >= 0) {
              checkCount++;
            }
          }
        }
      }
    }

    console.log('i = func checkbuttonstate no null 13', this.checkButtonState);
    if(!this.checkButtonState) {
      const subInputs = (this._SfFormC[0] as HTMLDivElement).querySelectorAll('input') as NodeListOf<HTMLInputElement>;
      for(var i = 0; i < subInputs.length; i++) {
        checkTotal++;
        const outerHtml = subInputs[i].nextElementSibling?.outerHTML;
        if(subInputs[i].hasAttribute('mandatory')) {
          if(outerHtml != null) {
            if(outerHtml!.indexOf('color-success') >= 0) {
              checkCount++;
            }
          }
        }
      }
    }

    if(checkCount < checkTotal / 2) this.checkButtonState = true;
    console.log('i = func checkbuttonstate no null 2', this.checkButtonState);

  }

  loopThroughSearchResults = async () => {

    this.setNotif('Refresh in progress...')

    // Indicates the page that has been processed
    var count = 0;

    while(true) {

      // Get the next button
      var buttonNext = (this._SfSearchListContainer as HTMLDivElement).querySelector('#button-next-cursor') as HTMLButtonElement;
      if(buttonNext != null && count > 0) {
        // If next button exists and if the flow is on the subsequent pages
        for(var k = 0; k < count; k++) {
          buttonNext.click();
          await this.fWait(3000);
          buttonNext = (this._SfSearchListContainer as HTMLDivElement).querySelector('#button-next-cursor') as HTMLButtonElement;
        }
      }

      // At this point, we have arrived on the right page
      // Get the list of view buttons
      var buttons = (this._SfSearchListContainer as HTMLDivElement).querySelectorAll('.button-search-view') as NodeListOf<HTMLButtonElement>;

      for(var i = 0; i < buttons.length; i++) {
        
        // Click the next view button and go to the detail page
        buttons[i].click();
        await this.fWait(2000);
        this.setNotif('Refresh in progress... ' + parseInt(((i*100)/buttons.length) + "%"))
        await this.fWait(3000);
        // Click the edit button
        (this._SfButtonEdit as HTMLButtonElement).click();
        await this.fWait(2000);
        // Validate all fields
        this.evalSubmit();
        await this.fWait(2000);
        // Submit, after success it goes back to the search screen
        (this._sfButtonSubmit as HTMLButtonElement).click();
        await this.fWait(5000);
        // Fetch the search list
        // await this.fetchSearch();
      }

      buttonNext = (this._SfSearchListContainer as HTMLDivElement).querySelector('#button-next-cursor') as HTMLButtonElement;
      if(buttonNext == null) {
        break;
      }

      // Increment the count that indicates the page that been processed
      count++;
      await this.fetchSearch();
      await this.fWait(5000);
      
      // // Get the next button
      // var buttonNext = (this._SfSearchListContainer as HTMLDivElement).querySelector('#button-next-cursor') as HTMLButtonElement;
      // if(buttonNext != null) {
      //   // If the next button exists
      //   for(var k = 0; k < count; k++) {
      //     buttonNext.click();
      //     await this.fWait(3000);
      //   }
        

      //   for(var i = 0; i < buttons.length; i++) {
      //     buttons[i].click();
      //     await this.fWait(2000);
      //     this.setNotif('Refresh in progress... ' + parseInt(((i*100)/buttons.length) + "%"))
      //     await this.fWait(3000);
      //     this.checkButtonStates();
      //     if(this.checkButtonState) {
      //       i--;
      //     } else {
      //       (this._SfButtonEdit as HTMLButtonElement).click();
      //       await this.fWait(5000);
      //       var allClear = false;
      //       while(!allClear) {
      //         this.checkButtonStates();
      //         await this.fWait(2000);
      //         if(!this.checkButtonState) {
      //           allClear = true;
      //         }
      //       }
      //       this.evalSubmit();
      //       await this.fWait(2000);
      //       (this._sfButtonSubmit as HTMLButtonElement).click();
      //       await this.fWait(5000);
      //       await this.fetchSearch();
      //       await this.fWait(2000);
      //       this.setNotif('Refresh in progress... ' + parseInt(((i*100)/buttons.length) + "%"))
      //       await this.fWait(3000);
      //       for(var k = 0; k < count; k++) {
      //         buttonNext.click();
      //         await this.fWait(3000);
      //       }
      //       buttons = (this._SfSearchListContainer as HTMLDivElement).querySelectorAll('.button-search-view') as NodeListOf<HTMLButtonElement>;
      //     }
      //   }
      //   count++;
      //   for(var k = 0; k < count; k++) {
      //     buttonNext.click();
      //     await this.fWait(3000);
      //   }
      //   //await this.fWait(5000);
      //   //break;
      // } else {
      //   break;
      // }
    }

  }

  initSearchView = () => {
    if(this.isAdmin()){
      (this._SfSearchFiltersContainer as HTMLElement).classList.remove('hide-important');
      (this._SfSearchBadge as HTMLElement).classList.remove('hide-important');
      this.fetchMasters(this.renderMastersSearch);
    } else {
      (this._SfSearchFiltersContainer as HTMLElement).classList.add('hide-important');
      (this._SfSearchBadge as HTMLElement).classList.add('hide-important');
    }
  }

  populateSearchFilterValues = () => {
    console.log('search params', this.searchParams)
    let filtersPresentFlag = false;
    for(let searchFilterId of this.searchFilterIds){
      if(this.searchParams.filters != null && this.searchParams.filters[searchFilterId] != null){   
        console.log('search field', searchFilterId, this.searchParams.filters[searchFilterId])
        if(this.searchParams.filters[searchFilterId].value.length > 0 && this.searchParams.filters[searchFilterId].value != 'noselect' ){
          filtersPresentFlag = true
        }
        let element = this._SfSearchFiltersContainer.querySelector('#' + searchFilterId) as HTMLElement
        if (element.tagName.toLowerCase() == "sf-i-form") {
          console.log('search field setting value', element, this.searchParams.filters[searchFilterId].value);
          (element as SfIForm).preselectedValues = JSON.stringify(this.searchParams.filters[searchFilterId].value);
          (element as SfIForm).loadMode();
          console.log('search field element', (element as SfIForm).selectedId)
        } else if (element.tagName.toLowerCase() == "select") {
          (element as HTMLSelectElement).value = this.searchParams.filters[searchFilterId].value;
        }
      }
    }
    
    setTimeout(() => {
      if(filtersPresentFlag){
        let event = new Event('click')
        this._sfButtonAll.dispatchEvent(event)
      }
    }, 2000);
  }

  initDecryptView = () => {
    if(this.isAdmin()){
      let divsArr = this._SfDecryptContainer.querySelectorAll("#decrypt-container > div")
      console.log('decrypt divs',divsArr);
      for(let divElement of divsArr){
        (divElement as HTMLElement).classList.remove('hide');
      }
      this.initDecryptListeners()
    } else {
      let divsArr = this._SfDecryptContainer.querySelectorAll("#decrypt-container > div")
      console.log('decrypt divs',divsArr);
      for(let divElement of divsArr){
        (divElement as HTMLElement).classList.add('hide');
      }
    }
  }

  initDecryptListeners = () => {
    (this._SfDecryptProjectInput as SfIForm).addEventListener('valueChanged',() => {
      let projectId = (this._SfDecryptProjectInput as SfIForm).selectedValues()[0]
      this.decryptProjectId = projectId.split(';')[projectId.split(';').length - 1];
      this.evalDecrypt()
    });
    (this._SfDecryptFileInput as HTMLInputElement).addEventListener('keyup',() => {
      console.log('keyup called');
      this.decryptFileName = (this._SfDecryptFileInput as HTMLInputElement).value;
      this.evalDecrypt()
    });
    (this._SfDecryptButton as HTMLButtonElement).addEventListener('click', () => {
      console.log('decrypt clicked', this.decryptProjectId, this.decryptFileName);
      this.submitDecrypt()
    })
  }

  evalDecrypt = () => {
    console.log((this._SfDecryptFileInput as HTMLInputElement))
    console.log('evalDecrypt', this.decryptProjectId, this.decryptFileName)
    if(this.decryptProjectId != null && this.decryptProjectId != "" && this.decryptFileName != null && this.decryptFileName.length > 3){
      (this._SfDecryptContainer?.querySelector('#button-decrypt') as HTMLButtonElement).removeAttribute('disabled');
    }else{
      (this._SfDecryptContainer?.querySelector('#button-decrypt') as HTMLButtonElement).setAttribute('disabled', 'true');
    }
  }

  submitDecrypt = async () => {

    this.clearMessages();

    console.log('submitDecrypt called');

    const body: any = {};
    let url = "https://"+this.apiId+"/getdecryptedjson";

    body["projectid"] = this.decryptProjectId; 
    body["key"] = this.decryptFileName + ".json"; 

    console.log(body);
    console.log(JSON.stringify(body));

    const authorization = btoa(Util.readCookie('email') + ":" + Util.readCookie('accessToken'));
    const xhr : any = (await this.prepareXhr(body, url, this._SfLoader, authorization)) as any;
    this._SfLoader.innerHTML = '';
    if(xhr.status == 200) {
      const jsonRespose = JSON.parse(xhr.responseText);
      console.log('decrypt response', jsonRespose)
      this.setSuccess('Operation Successful!');
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonRespose.data));
      a.download = this.decryptFileName + ".json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a); 

      setTimeout(() => {
        this.clearMessages();
      }, 2000);
      
    } else {
      const jsonRespose = JSON.parse(xhr.responseText);
      this.setError(jsonRespose.error);
      setTimeout(() => {
        this.clearMessages();
      }, 2000);
    }

  }

  initListenersView = () => {

    console.log('init listeners view');

    // this._sfInputSearch?.addEventListener('keyup', () => {

    //   console.log('keyup called');
    //   this.searchPhrase = this._sfInputSearch.value;
    //   if(this._sfInputSearch.value.length > 2) {
    //     this.fetchSearch();
    //   }
      
    // });

    this._SfButtonNew?.addEventListener('click', () => {
      this.mode = "new";
      this.loadMode();
    });

    this._sfButtonAll.addEventListener('click', () => {
      console.log('all clicked');
      // if(this.searchPhrase == null || this.searchPhrase.length === 0) {
      //   this.searchPhrase = "";
      // }
      this.fetchSearch();
    });

    this._SfSearchStartDate.addEventListener('change', () => {
      this._SfInputEndDate.setAttribute('min', new Date((this._SfSearchStartDate as HTMLInputElement).value).toISOString().slice(0, 10) )
      this.fetchLogs()
    });
    this._SfSearchEndDate.addEventListener('change', () => {
      this._SfSearchStartDate.setAttribute('max', new Date((this._SfSearchEndDate as HTMLInputElement).value).toISOString().slice(0, 10) )
      this.fetchLogs()
    });
  }

  initListenersTrail = async () => {

    this._SfButtonBack.addEventListener('click', () => {
      this.mode = "view";
      this.loadMode();
    });

    console.log(this._SfButtonFetchLog)
    this._SfButtonFetchLog.addEventListener('click', () => {
      console.log("fetch logs clicked", (this._SfInputStartDate as HTMLInputElement).value, (this._SfInputEndDate as HTMLInputElement).value)
      this.fetchLogs()
    })

    this._SfInputStartDate.addEventListener('change', () => {
      this._SfInputEndDate.setAttribute('min', new Date((this._SfInputStartDate as HTMLInputElement).value).toISOString().slice(0, 10) )
      this.fetchLogs()
    });
    this._SfInputEndDate.addEventListener('change', () => {
      this._SfInputStartDate.setAttribute('max', new Date((this._SfInputEndDate as HTMLInputElement).value).toISOString().slice(0, 10) )
      this.fetchLogs()
    });

  }

  clearUnitFilters = () => {

    for(var i = 0; i < this.getInputs().length; i++) {

      const element = this._sfSlottedForm[0].querySelector('#' + this.getInputs()[i]);

      if(element.nodeName.toLowerCase() == "sf-i-select") {

        (element as SfISelect).removedValues = [];

      } else if (element.nodeName.toLowerCase() == "sf-i-sub-select") {

        (element as SfISubSelect).removedValues = [];
        
      } else if (element.nodeName.toLowerCase() == "sf-i-form") {

        (element as SfIForm).removedValues = [];
        
      }

    }

  }

  processFiltersByEvent = () => {

    var filters = null;

    if(this.mode == "new") {
      filters = this.getUnitFiltersNew();
    }

    if(this.mode == "detail" || this.mode == "consumer") {
      filters = this.getUnitFiltersDetail();
    }

    for(var i = 0; i < filters.length; i++) {
      
      if(filters[i].op == "hide") {

        const inputElement = this._SfFormC[0].querySelector('#' + filters[i].input);
        const value = filters[i].value;

        //

        if(filters[i].input != null) {

          if((inputElement as HTMLInputElement).nodeName.toLowerCase() == "sf-i-select") {

            if(Array.isArray(value)) {

              var foundFlag = false;

              for(var j = 0; j < value.length; j++) {

                if((inputElement as SfISelect).selectedValues()[0] == value[j]) {
                  foundFlag = true;
                }

              }

              if(foundFlag) {
                if(Array.isArray(filters[i].target)) {
                  for(var k = 0; k < filters[i].target.length; k++) {
                    const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target[k]);
                    (targetElement as HTMLElement).style.display = 'none';
                  }
                } else {
                  const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target);
                  (targetElement as HTMLElement).style.display = 'none';
                }
                
              } else {
                if(Array.isArray(filters[i].target)) {
                  for(var k = 0; k < filters[i].target.length; k++) {
                    const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target[k]);
                    (targetElement as HTMLElement).style.display = 'inline';
                  }
                } else {
                  const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target);
                  (targetElement as HTMLElement).style.display = 'inline';
                }
              }

            } else {

              if((inputElement as SfISelect).selectedValues()[0] == value) {

                if(Array.isArray(filters[i].target)) {
                  for(var k = 0; k < filters[i].target.length; k++) {
                    const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target[k]);
                    (targetElement as HTMLElement).style.display = 'none';
                  }
                } else {
                  const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target);
                  (targetElement as HTMLElement).style.display = 'none';
                }
        
              } else {
  
                if(Array.isArray(filters[i].target)) {
                  for(var k = 0; k < filters[i].target.length; k++) {
                    const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target[k]);
                    (targetElement as HTMLElement).style.display = 'inline';
                  }
                } else {
                  const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target);
                  (targetElement as HTMLElement).style.display = 'inline';
                }
  
              }

            }


          } else if ((inputElement as HTMLInputElement).nodeName.toLowerCase() == "sf-i-sub-select") {

            if((inputElement as SfISubSelect).selectedValues()[0] == value) {
    
              if(Array.isArray(filters[i].target)) {
                for(var k = 0; k < filters[i].target.length; k++) {
                  const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target[k]);
                  (targetElement as HTMLElement).style.display = 'none';
                }
              } else {
                const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target);
                (targetElement as HTMLElement).style.display = 'none';
              }
      
            } else {

              if(Array.isArray(filters[i].target)) {
                for(var k = 0; k < filters[i].target.length; k++) {
                  const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target[k]);
                  (targetElement as HTMLElement).style.display = 'inline';
                }
              } else {
                const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target);
                (targetElement as HTMLElement).style.display = 'inline';
              }

            }

          } else if ((inputElement as HTMLInputElement).nodeName.toLowerCase() == "sf-i-form") {

            if((inputElement as SfIForm).selectedValues()[0] == value) {
    
              if(Array.isArray(filters[i].target)) {
                for(var k = 0; k < filters[i].target.length; k++) {
                  const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target[k]);
                  (targetElement as HTMLElement).style.display = 'none';
                }
              } else {
                const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target);
                (targetElement as HTMLElement).style.display = 'none';
              }
      
            } else {

              if(Array.isArray(filters[i].target)) {
                for(var k = 0; k < filters[i].target.length; k++) {
                  const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target[k]);
                  (targetElement as HTMLElement).style.display = 'inline';
                }
              } else {
                const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target);
                (targetElement as HTMLElement).style.display = 'inline';
              }


            }

          } else {

            if((inputElement as HTMLInputElement).value == value) {
    
              if(Array.isArray(filters[i].target)) {
                for(var k = 0; k < filters[i].target.length; k++) {
                  const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target[k]);
                  (targetElement as HTMLElement).style.display = 'none';
                }
              } else {
                const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target);
                (targetElement as HTMLElement).style.display = 'none';
              }
      
            } else {

              if(Array.isArray(filters[i].target)) {
                for(var k = 0; k < filters[i].target.length; k++) {
                  const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target[k]);
                  (targetElement as HTMLElement).style.display = 'inline';
                }
              } else {
                const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target);
                (targetElement as HTMLElement).style.display = 'inline';
              }

            }

          }        
  

        } else {

          if(Array.isArray(filters[i].target)) {
            for(var k = 0; k < filters[i].target.length; k++) {
              const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target[k]);
              (targetElement as HTMLElement).style.display = 'none';
            }
          } else {
            const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target);
            (targetElement as HTMLElement).style.display = 'none';
          }

        }

        console.log('processing filters element', inputElement);

      }

    }

  }

  completeSelect = () => {

    var found = false;
    let valToAdd = (this._SfSearchMultiselectSelect as HTMLSelectElement)!.value
    console.log('valToAdd', valToAdd)
    if(valToAdd != "noselect" && valToAdd != ""){
      for (let selectedVal of this.multiselectArr){
        if(selectedVal == valToAdd){
          found = true
        }
      }
    }
    if(!found && valToAdd != "noselect" && valToAdd != ""){
      this.multiselectArr.push(valToAdd)
    }
    // var divArr = (this._SfSearchMultiselectSelected as HTMLDivElement).querySelectorAll('div');
    
    // for(var i = 0; i < divArr.length; i++) {

    //   console.log(divArr[i], divArr[i].innerHTML)
    //   if(divArr[i].innerHTML == (this._SfSearchMultiselectSelect as HTMLSelectElement)!.value) {
    //     found = true;
    //   }

    // }
    let html = ''
    for(var i = 0; i < this.multiselectArr.length; i++) {

      html += `<div part="badge-multiselected" class="badge-multiselected d-flex align-center"><div part="button-icon-small-cancel" class="d-flex material-icons color-gray pointer button-icon-small-cancel" id="search-multiselect-delete-${i}">cancel</div>`+this.multiselectArr[i]+`</div>`;

    }

    (this._SfSearchMultiselectSelected as HTMLDivElement).innerHTML =  html;
    (this._SfSearchMultiselectInput as HTMLInputElement).value = '';
    if(this.multiselectArr.length > 0){
      (this._SfSearchMultiselectInput as HTMLInputElement).focus();
    }
    (this._SfSearchMultiselectSelect as HTMLSelectElement).selectedIndex = 0;
    (this._SfSearchMultiselectSelect as HTMLSelectElement).style.display = 'none';
    if(this.multiselectArr.length > 0){
      (this._SfSearchMultiselectDelete as HTMLSelectElement).style.display = 'flex';
    }else{
      (this._SfSearchMultiselectDelete as HTMLSelectElement).style.display = 'none';
    }
    for(i = 0; i < this.multiselectArr.length; i++) {
      let index = i;
      ((this._SfSearchMultiselectSelected as HTMLDivElement).querySelector('#search-multiselect-delete-' + i) as HTMLDivElement).addEventListener('click',() => {
        console.log("deleting 1", this.multiselectArr[index] , index)
        this.removeFromMultiselect(index)
      })

    }
    
    if(!found) {
      // let compareString = '<div part="badge-multiselected" class="badge-multiselected">'
      // let innerHtml = (this._SfSearchMultiselectSelected as HTMLDivElement).innerHTML
      // var count = (innerHtml.split(compareString).length) - 1;
      // console.log('count', count)
      // var html = '';
      // let val = (this._SfSearchMultiselectSelect as HTMLSelectElement)!.value
      // html += `<div part="badge-multiselected" class="badge-multiselected">`+val+`<div part="button-icon-small" class="d-flex hide material-icons color-gray pointer" id="search-multiselect-delete-${count}" style="display: flex;">delete</div></div>`;
      // (this._SfSearchMultiselectSelected as HTMLDivElement).insertAdjacentHTML('beforeend', html);
      // (this._SfSearchMultiselectInput as HTMLInputElement).value = '';
      // (this._SfSearchMultiselectInput as HTMLInputElement).focus();
      // (this._SfSearchMultiselectSelect as HTMLSelectElement).selectedIndex = 0;
      // (this._SfSearchMultiselectSelect as HTMLSelectElement).style.display = 'none';
      // (this._SfSearchMultiselectDelete as HTMLSelectElement).style.display = 'flex';
      // ((this._SfSearchMultiselectSelected as HTMLDivElement).querySelector('#search-multiselect-delete-' + count) as HTMLDivElement).addEventListener('click',() => {
      //   console.log("deleting 1", val , count)
      //   this.removeFromMultiselect(val, count)
      // },false)
      this.dispatchMyEvent("valueChanged", {});
    }

  }

  removeFromMultiselect = (index:number) => {
    console.log('unchanged arr', this.multiselectArr)
    if(index==0 && this.multiselectArr.length == 1){
      this.multiselectArr = []
    }else{
      this.multiselectArr.splice(index,1)
    }
    console.log('changed arr', this.multiselectArr)
    this.completeSelect()
    // var html = `<div part="badge-multiselected" class="badge-multiselected">`+val+`<div part="button-icon-small" class="d-flex hide material-icons color-gray pointer" id="search-multiselect-delete-${count}" style="display: flex;">delete</div></div>`;
    // let innerHtml = (this._SfSearchMultiselectSelected as HTMLDivElement).innerHTML
    // console.log('html', html)
    // console.log('innerhtml', innerHtml)
    // innerHtml = innerHtml.replace(html,'');
    // (this._SfSearchMultiselectSelected as HTMLDivElement).innerHTML = innerHtml
    this.dispatchMyEvent("valueChanged", {});
  }

  initListenersMultiselect = () => {

    (this._SfSearchMultiselectInput as HTMLInputElement)!.addEventListener('keyup', () => {

      (this._SfSearchMultiselectSelect as HTMLSelectElement)!.style.display = 'block';  
      this.fetchSearchMultiselect();

    });

    (this._SfSearchMultiselectSelect as HTMLSelectElement)!.addEventListener('change', () => {
      console.log('change');
      const value = (this._SfSearchMultiselectSelect as HTMLSelectElement)!.value;
      if(value != "" && value != "noselect") {
        this.completeSelect();
      }
    });

    (this._SfSearchMultiselectDelete as HTMLSelectElement)!.addEventListener('click', () => {
      (this._SfSearchMultiselectSelected as HTMLDivElement)!.innerHTML = '';
      (this._SfSearchMultiselectDelete as HTMLSelectElement)!.style.display = 'none';
      this.dispatchMyEvent("valueChanged", {});
    });

  }

  initPrepopulateNew = () => {
    if(!this.isAdmin()){
      let elementProject = this._sfSlottedForm[0].querySelector('#sf-i-project') as SfIForm;
      elementProject.flow = "read";
      elementProject.selectedSearchId = [Util.readCookie('projectId')];
      console.log('prepopulate input project',elementProject.selectedSearchId);
      elementProject.loadMode()
    
      let elementInitiator = this._sfSlottedForm[0].querySelector('#sf-i-initiator') as SfIForm;
      elementInitiator.flow = "read";
      elementInitiator.selectedSearchId = [this.userid];
      elementInitiator.loadMode();
      console.log('prepopulate input initiator',(elementInitiator as SfIForm).selectedSearchId)
    }
  }

  initListenersNew = () => {

    this._SfButtonBack.addEventListener('click', () => {
      this.mode = "view";
      this.loadMode();
    });

    this._sfButtonSubmit.addEventListener('click', () => {
      this.submitNew();
    });
    

    for(var i = 0; i < this.getInputs().length; i++) {

      const element = this._sfSlottedForm[0].querySelector('#' + this.getInputs()[i]);

      if(element.nodeName.toLowerCase() == "sf-i-select") {

        element.addEventListener('valueChanged', () => {
          this.evalSubmit();
          this.processFiltersByEvent();
        });

      } else if (element.nodeName.toLowerCase() == "sf-i-sub-select") {

        element.addEventListener('valueChanged', () => {
          this.evalSubmit();
          this.processFiltersByEvent();
        });

      } else if (element.nodeName.toLowerCase() == "sf-i-form") {

        element.addEventListener('valueChanged', () => {
          this.evalSubmit();
          this.processFiltersByEvent();
        });

      } else if (element.nodeName.toLowerCase() == "sf-i-uploader") {
        element.addEventListener('uploadValid', () => {
          this.evalSubmit();
          this.processFiltersByEvent();
        })
        // element.addEventListener('uploadCompleted', () => {
        //   console.log('value changed', element.nodeName.toLowerCase(), element.value)
        //   this.evalSubmit();
        //   this.processFiltersByEvent();
        // });
        // element.addEventListener('analysisCompleted', () => {
        //   console.log('value changed', element.nodeName.toLowerCase(), element.value)
        //   this.evalSubmit();
        //   this.processFiltersByEvent();
        // });

      } else if (element.nodeName.toLowerCase() == "select") {
        element.addEventListener('change', () => {
          this.evalSubmit();
          this.processFiltersByEvent();
          console.log("select changed")
        })
        // element.addEventListener('uploadCompleted', () => {
        //   console.log('value changed', element.nodeName.toLowerCase(), element.value)
        //   this.evalSubmit();
        //   this.processFiltersByEvent();
        // });
        // element.addEventListener('analysisCompleted', () => {
        //   console.log('value changed', element.nodeName.toLowerCase(), element.value)
        //   this.evalSubmit();
        //   this.processFiltersByEvent();
        // });

      } else {

        element.addEventListener('keyup', () => {
          this.evalSubmit();
          this.processFiltersByEvent();
        });

      }

    }

  }

  initListenersSearch = () => {

    if(this._sfInputSearchSelect != null) {
      this._sfInputSearchSelect.addEventListener('keyup', (e: any) => {

        if(e.key.toLowerCase() == "enter") {

          this.searchPhrase = this.searchPhraseOriginal + '&(' + ((this._sfInputSearchSelect as HTMLInputElement).value + "|" + (this._sfInputSearchSelect as HTMLInputElement).value.toLowerCase() + "|" + (this._sfInputSearchSelect as HTMLInputElement).value.toUpperCase()) + ")";
          console.log(this.searchPhrase);
          this.prevCursor = [];
          this.nextCursor = [];
          this.fetchSearchSelect();
        } else {
          console.log(e);
        }

      });
    }

  }

  initListenersDetail = () => {
    this._SfButtonBack.addEventListener('click', () => {
      this.mode = "view";
      this.prevCursor = [];
      this.nextCursor = [];
      this.loadMode();
    });
    if(this._SfButtonEdit != null) {
      this._SfButtonEdit.addEventListener('click', () => {
        this.disableEdit(false);
        this.initDisableInputs(false)
      })
    }
    
    if(this._SfButtonEditCancel != null) {
      this._SfButtonEditCancel.addEventListener('click', () => {
        this.disableEdit(true);
        this.initDisableInputs(true)
      })
    }

    if(this._SfButtonDelete != null) {
      this._SfButtonDelete.addEventListener('click', () => {
        this.disableConfirm(false);
      })
    }

    if(this._SfButtonDeleteCancel != null) {
      this._SfButtonDeleteCancel.addEventListener('click', () => {
        this.disableConfirm(true);
      })
    }

    if(this._sfButtonSubmit != null) {
      this._sfButtonSubmit?.addEventListener('click', () => {
        console.log('submit clicked');
        this.submitEdit();
      });
    }

    if(this._SfButtonDeleteConfirm != null) {
      this._SfButtonDeleteConfirm.addEventListener('click', () => {
        this.submitDelete();
      })
    }

    if(this._sfButtonCalendar != null) {
      this._sfButtonCalendar.addEventListener('click', () => {
        this.disableCalendar(false);
      })
    }

    if(this._sfButtonCalendarCancel != null) {
      this._sfButtonCalendarCancel.addEventListener('click', () => {
        this.disableCalendar(true);
      })
    }

    for(var i = 0; i < this.getInputs().length; i++) {

      const element = this._sfSlottedForm[0].querySelector('#' + this.getInputs()[i]);

      if(element.nodeName.toLowerCase() == "sf-i-select") {

        element.addEventListener('valueChanged', () => {
          console.log('value changed', element.nodeName.toLowerCase(), element.value)
          this.evalSubmit();
          this.processFiltersByEvent();
        });

      } else if (element.nodeName.toLowerCase() == "sf-i-sub-select") {

        element.addEventListener('valueChanged', () => {
          this.evalSubmit();
          this.processFiltersByEvent();
        });

      } else if (element.nodeName.toLowerCase() == "sf-i-form") {

        element.addEventListener('valueChanged', () => {
          this.evalSubmit();
          this.processFiltersByEvent();
        });

      } else if (element.nodeName.toLowerCase() == "sf-i-uploader") {
        element.addEventListener('uploadValid', () => {
          this.evalSubmit();
          this.processFiltersByEvent();
        })
        // element.addEventListener('uploadCompleted', () => {
        //   console.log('value changed', element.nodeName.toLowerCase(), element.value)
        //   this.evalSubmit();
        //   this.processFiltersByEvent();
        // });
        // element.addEventListener('analysisCompleted', () => {
        //   console.log('value changed', element.nodeName.toLowerCase(), element.value)
        //   this.evalSubmit();
        //   this.processFiltersByEvent();
        // });

      } else if (element.nodeName.toLowerCase() == "select") {
        element.addEventListener('change', () => {
          this.evalSubmit();
          this.processFiltersByEvent();
          console.log("select changed")
        })
        // element.addEventListener('uploadCompleted', () => {
        //   console.log('value changed', element.nodeName.toLowerCase(), element.value)
        //   this.evalSubmit();
        //   this.processFiltersByEvent();
        // });
        // element.addEventListener('analysisCompleted', () => {
        //   console.log('value changed', element.nodeName.toLowerCase(), element.value)
        //   this.evalSubmit();
        //   this.processFiltersByEvent();
        // });

      }else {

        element.addEventListener('keyup', () => {
          this.evalSubmit();
          this.processFiltersByEvent();
        });

      }

    }
  }

  populateSelectedViewToDetailValues = () => {

    console.log('populating selected', this.getSelectedViewToDetailValues());

    for(var i = 0; i < this.getInputs().length; i++) {
      
      const element = this._sfSlottedForm[0].querySelector('#' + this.getInputs()[i]);
      const val = this.selectedTicketDetails[this.getFields()[i]]
      console.log('populating detail',element, element.nodeName.toLowerCase(), val);

      if(element.nodeName.toLowerCase() == "sf-i-select") {

        (element as SfISelect).selectedId = this.getSelectedViewToDetailValues()[i];
        (element as SfISelect).loadMode();

      } else if (element.nodeName.toLowerCase() == "sf-i-sub-select") {

        (element as SfISubSelect).selectedId = this.getSelectedViewToDetailValues()[i];
        (element as SfISubSelect).loadMode();

      } else if (element.nodeName.toLowerCase() == "sf-i-form") {

        if(element.id == "sf-i-project"){
          console.log("input project val", val, element, element.flow)
        }

        (element as SfIForm).selectedSearchId = [val.value[0] ?? ""];
        (element as SfIForm).loadMode();
        console.log('populating selected', (element as SfIForm).selectedSearchId, element);
      } else if (element.nodeName.toLowerCase() == "sf-i-uploader") {
        // (element as SfIUploader).prepopulatedInputArr = JSON.stringify(this.getSelectedViewToDetailValues()[i]);
        // (element as SfIUploader).loadMode();

      } else if (element.nodeName.toLowerCase() == "select") {
        (element as HTMLSelectElement).value = val.value;

      } else if (this.getFields()[i] == 'comments') {
        console.log("populating comments", val);
        let html = ``
        let tempVal = val;
        tempVal.sort(function(a:any, b:any) {
          var keyA = a.timestamp,
            keyB = b.timestamp;
          // Compare the 2 timestamps
          if (keyA > keyB) return -1;
          if (keyA < keyB) return 1;
          return 0;
        });
        for( var j = 0; j < tempVal.length; j++){
          console.log('populating comments 1',this.selectedTicketDetails['initiator'].value, tempVal[j]['userid'] )
          if(tempVal[j]['userid'] == this.userid){
            html += `<div part="comment-user" class="comment-user d-flex align-start flex-wrap flex-col">`
          }else{
            html += `<div part="comment-user" class="comment-user d-flex align-start flex-wrap flex-col align-self-end">`
          }
          
          html += `<p part="comment-user-name">${tempVal[j]['username']}</p>`
          html += `<p part="comment-user-content">${tempVal[j]['content']['value']}</p>`
          if(tempVal[j]['attachment'] != null){
            html += `<sf-i-uploader id="sf-i-comment-attachment-${j}" part="comment-user-attachment" max="10" apiid="1peg5170d3" allowedextensions="[&quot;jpg&quot;,&quot;png&quot;]" extract="no" mode="view" maximize="yes"></sf-i-uploader>`
          }
          let createDate = new Date(parseInt(tempVal[j]['timestamp']))
          html += `<p part="comment-user-timestamp">${createDate.toLocaleDateString()}-${createDate.toLocaleTimeString()}</p>`
          html += `</div>`
        }
        console.log('comments populated', html);
        (element as HTMLDivElement).innerHTML = html;
        for( var j = 0; j < val.length; j++){
          if(val[j]['attachment'] != null){
            let uploaderElement = (element.querySelector(`#sf-i-comment-attachment-${j}`) as SfIUploader)
            uploaderElement.prepopulatedInputArr = JSON.stringify(tempVal[j]['attachment']['value']);
            uploaderElement.loadMode();
            console.log('comment uploader', uploaderElement, uploaderElement.prepopulatedInputArr)
          }
        }
      } else {
        if(this.getSelectedViewToDetailValues()[i] != null){
          (element as HTMLInputElement).value = this.getSelectedViewToDetailValues()[i];
          (element as HTMLInputElement).dispatchEvent(new Event('keyup'));
        }

      }

    }

  }

  checkIfAlreadySelected = (value :string) => {

    const arrSelected = (this._SfSearchMultiselectSelected as HTMLDivElement).querySelectorAll('div') as NodeListOf<HTMLDivElement>;

    for(var i = 0; i < arrSelected.length; i++) {

      if(arrSelected[i].innerHTML == value) {
        return true;
      }

    }

    return false;
  }

  populatePreselected = () => {

    (this._SfSearchMultiselectSelected as HTMLDivElement).innerHTML = '';

    for(var i = 0; i < (this.getPreselectedValues() as Array<any>).length; i++) {
      if(this.multiselectArr.indexOf(this.getPreselectedValues()[i]) < 0){
        console.log('pushing to multiselect', this.getPreselectedValues()[i],i)
        this.multiselectArr.push(this.getPreselectedValues()[i])
      }
      
      // if(!this.checkIfAlreadySelected(this.getPreselectedValues()[i])) {
      //   var html = '';
      //   html += '<div part="badge-multiselected" class="badge-multiselected">'+this.getPreselectedValues()[i]+'</div>';
      //   (this._SfSearchMultiselectSelected as HTMLDivElement).insertAdjacentHTML('beforeend', html);
      // }

    }
    this.completeSelect()
    console.log((this._SfSearchMultiselectSelected as HTMLDivElement)!.innerHTML);

    if((this.getPreselectedValues() as Array<any>).length > 0) {
      (this._SfSearchMultiselectDelete as HTMLSelectElement)!.style.display = 'flex';
    } else {
      (this._SfSearchMultiselectDelete as HTMLSelectElement)!.style.display = 'none';
    }
    

  }

  processDisabled = () => {

    for(var i = 0; i < this.getInputs().length; i++) {

      const element = this._sfSlottedForm[0].querySelector('#' + this.getInputs()[i]);
      if(this.mode == "view" || this.mode == "delete") {
        element.setAttribute('disabled', true);
      }

    }

  }

  processUnitFiltersNew = () => {

    console.log('filters', this.getUnitFiltersNew().length, "select");

    for(var i = 0; i < this.getUnitFiltersNew().length; i++) {

      if(this.getUnitFiltersNew()[i].op == "select") {

        const inputElement = this._SfFormC[0].querySelector('#' + this.getUnitFiltersNew()[i].input);
        console.log('filters', inputElement, this.getUnitFiltersNew()[i], "select");
        if(this.getUnitFiltersNew()[i].disable == "true"){
          console.log('filters disabling', inputElement);
          (inputElement as HTMLElement).setAttribute('disabled', "true")
          continue;
        }
        const value = this.getUnitFiltersNew()[i].value;

        console.log('filters', inputElement, value, "select");

        if((inputElement as HTMLElement).tagName.toLowerCase() == "sf-i-select") {

          console.log('filters-select', "sf-i-select", value);
          (inputElement as SfISelect).selectedId = value;
          (inputElement as SfISelect).loadMode();

        } else if((inputElement as HTMLElement).tagName.toLowerCase() == "sf-i-sub-select") {

          console.log('filters-select', "sf-i-sub-select", value);
          (inputElement as SfISubSelect).selectedId = value;
          (inputElement as SfISubSelect).loadMode();

        } else if((inputElement as HTMLElement).tagName.toLowerCase() == "sf-i-form") {

          console.log('filters-select', "sf-i-form", value);
          (inputElement as SfIForm).selectedSearchId = value;
          (inputElement as SfIForm).loadMode();

        }else{
          (inputElement as HTMLSelectElement).value = value
        }

      }

      if(this.getUnitFiltersNew()[i].op == "remove") {

        const inputElement = this._SfFormC[0].querySelector('#' + this.getUnitFiltersNew()[i].input);
        const value = this.getUnitFiltersNew()[i].value;

        console.log('filters', inputElement, value, "remove");

        if((inputElement as HTMLElement).tagName.toLowerCase() == "sf-i-select") {

          console.log('filters-remove', "sf-i-select", value);
          (inputElement as SfISelect).removeItemByValue(value);
          (inputElement as SfISelect).loadMode();

        } else if((inputElement as HTMLElement).tagName.toLowerCase() == "sf-i-sub-select") {

          console.log('filters-remove', "sf-i-sub-select", value);
          (inputElement as SfISubSelect).removeItemByValue(value);
          (inputElement as SfISubSelect).loadMode();

        } else if((inputElement as HTMLElement).tagName.toLowerCase() == "sf-i-form") {

          console.log('filters-remove', "sf-i-form", value);
          (inputElement as SfIForm).removeItemByValue(value);
          (inputElement as SfIForm).loadMode();

        }

      }

    }

  }

  processUnitFiltersDetail = () => {

    console.log('filters', this.getUnitFiltersDetail().length, "select");

    for(var i = 0; i < this.getUnitFiltersDetail().length; i++) {

      if(this.getUnitFiltersDetail()[i].op == "select") {

        const inputElement = this._SfFormC[0].querySelector('#' + this.getUnitFiltersDetail()[i].input);
        const value = this.getUnitFiltersDetail()[i].value;

        console.log('filters', inputElement, value, "select");

        if((inputElement as HTMLElement).tagName.toLowerCase() == "sf-i-select") {

          console.log('filters-select', "sf-i-select", value);
          (inputElement as SfISelect).selectedId = value;
          (inputElement as SfISelect).loadMode();

        } else if((inputElement as HTMLElement).tagName.toLowerCase() == "sf-i-sub-select") {

          console.log('filters-select', "sf-i-sub-select", value);
          (inputElement as SfISubSelect).selectedId = value;
          (inputElement as SfISubSelect).loadMode();

        } else if((inputElement as HTMLElement).tagName.toLowerCase() == "sf-i-form") {

          console.log('filters-select', "sf-i-form", value);
          (inputElement as SfIForm).selectedSearchId = value;
          (inputElement as SfIForm).loadMode();

        }

      }

      if(this.getUnitFiltersDetail()[i].op == "remove") {

        const inputElement = this._SfFormC[0].querySelector('#' + this.getUnitFiltersDetail()[i].input);
        const value = this.getUnitFiltersDetail()[i].value;

        console.log('filters', inputElement, value, "remove");

        if((inputElement as HTMLElement).tagName.toLowerCase() == "sf-i-select") {

          console.log('filters-remove', "sf-i-select", value);
          (inputElement as SfISelect).removeItemByValue(value);
          (inputElement as SfISelect).loadMode();

        } else if((inputElement as HTMLElement).tagName.toLowerCase() == "sf-i-sub-select") {

          console.log('filters-remove', "sf-i-sub-select", value);
          (inputElement as SfISubSelect).removeItemByValue(value);
          (inputElement as SfISubSelect).loadMode();

        } else if((inputElement as HTMLElement).tagName.toLowerCase() == "sf-i-form") {

          console.log('filters-remove', "sf-i-form", value);
          (inputElement as SfIForm).removeItemByValue(value);
          (inputElement as SfIForm).loadMode();

        }

      }

    }

  }

  // initListenerClipboardControls = () => {

  //   if(this.mode == "new") {

  //     Util.replaceElement((this._SfButtonCopypastePaste as HTMLButtonElement));
  //     (this._SfButtonCopypastePaste as HTMLButtonElement).addEventListener('click', async () => {
  //       let values: string = "";
  //       try{
  //         values = JSON.parse(await navigator.clipboard.readText());
  //       } catch (e: any) {
  //         console.log(e);
  //         this.setError('Clipboard contains no data!');
  //         setTimeout(() => {this.clearMessages()}, 3000);
  //       }
  //       this.renderClipboard(values);
  //       this.renderNewAfterContentPopulated();
  //     });

  //   }

  //   if(this.mode == "detail") {

  //     Util.replaceElement((this._SfButtonCopypasteCopy as HTMLButtonElement));
  //     (this._SfButtonCopypasteCopy as HTMLButtonElement).addEventListener('click', async () => {
  //       const values: string = JSON.stringify(this.populateValues());
  //       await navigator.clipboard.writeText((values));
  //       this.setSuccess('Copied to clipboard!')
  //       setTimeout(()=> {this.clearMessages()}, 3000);
  //       console.log(JSON.parse(await navigator.clipboard.readText()));
  //     });

  //   }

  // }

  renderNewAfterContentPopulated = () => {

    console.log('renderNewAfterContentPopulated');

    this.populateSelectedViewToDetailValues();
    // this.initListenersNew();
    this.processFormLayouting();
    this.clearUnitFilters();
    this.processUnitFiltersNew();
    // this.initListenerClipboardControls();

    if(this.mode == "consumer") {
      this.hideDelete();
      this.hideBack();
    }
  }

  renderDetailAfterContentPopulated = () => {
    this.populateSelectedViewToDetailValues();
    this.initListenersDetail();
    this.processFormLayouting();
    this.clearUnitFilters();
    this.processUnitFiltersDetail();
    // this.initListenerClipboardControls();

    if(this.mode == "consumer") {
      this.hideDelete();
      this.hideBack();
    }
  }

  loadMode = async () => {

    console.log('load mode', this.mode);

    if(this.mode == "multiselect-dropdown") {

      setTimeout(() => {
        this.initListenersMultiselect();
        this.populatePreselected();
      }, 500)

    } else if(this.mode == "text") {

      this.selectedTextPhrase = await this.fetchDetail();

    } else if(this.mode == "select" || this.mode == "list") {

      setTimeout(() => {
        // this.initListenersTrail();
        this.searchPhraseOriginal = this.searchPhrase;
        console.log('searchPhrase loadmode', this.searchPhrase);
        this.prevCursor = [];
        this.nextCursor = [];
        this.fetchSearchSelect();
        this.initListenersSearch();
      }, 500)

    } else if(this.mode == "trail") {

      setTimeout(async () => {
        this.initListenersTrail();
        let d = new Date();
        let [day,month,year] = Util.getDayMonthYear(d)
        let lastWeek = new Date();
        lastWeek.setDate(d.getDate() - 7);
        let [lastday,lastmonth,lastyear] = Util.getDayMonthYear(lastWeek);
        (this._SfInputStartDate as HTMLInputElement).value = "" + lastyear + "-" + lastmonth + "-" + lastday; 
        (this._SfInputEndDate as HTMLInputElement).value = "" + year + "-" + month + "-" + day 
        this._SfInputEndDate.setAttribute('min', new Date((this._SfInputStartDate as HTMLInputElement).value).toISOString().slice(0, 10) )
        this._SfInputStartDate.setAttribute('max', new Date((this._SfInputEndDate as HTMLInputElement).value).toISOString().slice(0, 10) )
        this.fetchLogs()
      }, 500)

    } else if(this.mode == "latest") {

      setTimeout(async () => {
        // this.initListenersTrail();
        this.fetchLatest()
      }, 500)

    } else if(this.mode == "new") {

      setTimeout(async () => {
        await this.initShowInputs();
        this.initDisableInputs(false);
        this.initListenersNew();
        this.processDependencies();
        this.processFormLayouting();
        this.clearInputs();
        this.clearUnitFilters();
        this.processUnitFiltersNew();
        this.initPrepopulateNew();
        // this.showControls();
        // this.initListenerClipboardControls();
      }, 500)

    } else if(this.mode == "downloader") {
      setTimeout(()=>{
        this.initDecryptView();
      }, 500)
    } else if(this.mode == "view") {

      setTimeout(() => {
        this.initSearchView();
        this.initListenersView();
        let d = new Date();
        let [day,month,year] = Util.getDayMonthYear(d)
        let lastWeek = new Date();
        lastWeek.setDate(d.getDate() - 7);
        let [lastday,lastmonth,lastyear] = Util.getDayMonthYear(lastWeek);
        (this._SfSearchStartDate as HTMLInputElement).value = "" + lastyear + "-" + lastmonth + "-" + lastday; 
        (this._SfSearchEndDate as HTMLInputElement).value = "" + year + "-" + month + "-" + day 
        this._SfSearchEndDate.setAttribute('min', new Date((this._SfSearchStartDate as HTMLInputElement).value).toISOString().slice(0, 10) )
        this._SfSearchStartDate.setAttribute('max', new Date((this._SfSearchEndDate as HTMLInputElement).value).toISOString().slice(0, 10) )

        // let event = new Event('click')
        // this._sfButtonAll.dispatchEvent(event)
        // this._sfInputSearch.value = this.searchPhrase == null ? "" : this.searchPhrase;
        // var event = new Event('keyup');
        // this._sfInputSearch.dispatchEvent(event);
      }, 500)
      

    } else if (this.mode == "detail" || (this.mode == "consumer" && this.selectedId.length != null && this.selectedId.length > 0)) {

        console.log('load mode detail');

        setTimeout(async () => {  
          console.log('load mode detail 1')
          if(this._SfCalendarC != null && this._SfCalendarC[0] != null) {

            (this._SfCalendarC[0].querySelector('sf-i-events') as SfIEvents).apiIdList = this.apiId;
            (this._SfCalendarC[0].querySelector('sf-i-events') as SfIEvents).apiBodyList = "{\"id\": \""+this.selectedId+"\"}";
            (this._SfCalendarC[0].querySelector('sf-i-events') as SfIEvents).loadMode();
      
          }

          await this.initShowInputs();
          console.log("disabling edits 1", true)
          this.disableEdit(true);
          if(this.apiIdCalendarDetail != "") {
            this.disableCalendar(true);
          }
          this.initDisableInputs(true, false);
          this.processDependencies();
          await this.fetchDetail();
          this.renderDetailAfterContentPopulated();

        }, this.mode == "detail" ? 3000 : 3000)
      
    }

  }

  isAdmin = () => {
    return Util.readCookie('admin') == "true"
  }

  constructor() {
    super();
  }

  protected override firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {

    this.loadMode();

  }
  
  override connectedCallback() {
    super.connectedCallback()
  }
  
  override render() {

    console.log('form mode', this.mode, this.selectedId);

    if(this.mode == "multiselect-dropdown") {

      return html`
          
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <div class="SfITicketingC">
          <label part="input-label">${this.label}</label>
          <div>
            <div class="d-flex justify-center align-start flex-wrap">
              <div class="d-flex" id="search-multiselect-selected"></div>
              <div part="button-icon-small" class="d-flex hide material-icons color-gray pointer" id="search-multiselect-delete">delete</div>
              <div class="d-flex flex-col">
                <input part="input" id="search-multiselect-input" type="text" />
                <select part="input-select" id="search-multiselect-select" class="hide"></select>
              </div>
            </div>
          </div>
          <div class="loader-element"></div>
          <div class="d-flex justify-between">
            <div class="lb"></div>
            <div>
              <div class="div-row-error div-row-submit gone">
                <div part="errormsg" class="div-row-error-message"></div>
              </div>
              <div class="div-row-success div-row-submit gone">
                <div part="successmsg" class="div-row-success-message"></div>
              </div>
            </div>
            <div class="rb"></div>
          </div>
        </div>

        `;

    } else if(this.mode == "list") {

      if(this.flow == "read") {


        return html`
          
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
          <div class="SfITicketingC">
            <label part="input-label">${this.label}</label>
            <div>
              <div id="search-select-container">
                <h3 part="results-title" class="left-sticky">No Results</h3>
              </div>
              <div class="loader-element"></div>
            </div>
            

          </div>

          `;

      } else {


        return html`
            
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
          <div class="SfITicketingC">
            <label part="input-label">${this.label}</label>
            <div>
              <div id="search-select-container">
                <h3 part="results-title" class="left-sticky">No Results</h3>
              </div>
              <div class="loader-element"></div>
            </div>
          </div>

        `;

      }


    } else if(this.mode == "read") {


      return html`
        
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <div class="SfITicketingC">
          <label part="input-label" >${this.label}</label>
          <div>
            <select id="input-select" @change="${this.onChangeSelect}" disabled>
            </select>
            <div class="loader-element"></div>
          </div>
        </div>
      
      `;

    } else if(this.mode == "latest") {


      return html`
        
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <div class="SfITicketingC">
          <label part="input-label" >${this.label}</label>
          <div part="latest-container">
            <div part="latest-list-container" id="latest-list-container" class="flex-grow"></div>
          </div>
          <div>
            <div class="loader-element"></div>
          </div>
        </div>
      
      `;

    } else if(this.mode == "select") {

      if(this.flow == "read") {

        return html`

        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <div class="SfITicketingC">
          <label part="input-label">${this.label}</label>
          <div>
            <div id="search-select-container">
              <h3 part="results-title" class="left-sticky">No Results</h3>
            </div>
            <div class="loader-element"></div>
          </div>
          
        </div>
        
      `;

      } else {
        return html`
        
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <div class="SfITicketingC">
          <br />
          <label part="input-label">${this.label}</label>
          <div>
            <div>
              <input part="input" id="select-search-input" class="mb-10" placeholder="Filter" />
              <div id="search-select-container">
                <h3 part="results-title" class="left-sticky">No Results</h3>
              </div>
              <div class="loader-element"></div>
            </div>
          </div>
        </div>
      
      `;

      }

      

    } else if(this.mode == "trail") {

      return html`
        
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <div class="SfITicketingC">
          <div class="d-flex justify-center">
              <h1 part="title">${this.name}</h1>
          </div>
          <div class="d-flex justify-center">
            <div part="badge" class="badge">Log Trail</div>
          </div>
          <br />
          <div class="d-flex">
            <div class="lb"></div>
            <div class="d-flex flex-grow justify-between">
              <button id="button-back" part="button-icon" class="button-icon"><span class="material-icons">keyboard_backspace</span></button>
              <div class="d-flex">
              </div>
            </div>
            <div class="rb"></div>
          </div>
          <br />
          <div class="d-flex">
            <div class="lb"></div>
            <div class="w-50-m-0">
              <label part="input-label">From Date *</label><br>
              <input part="input" id="input-startdate" type="date" class="w-100-m-0" mandatory="" autocomplete="off" style="display: block;">
            </div>
            <div class="w-50-m-0">
              <label part="input-label">To Date *</label><br>
              <input part="input" id="input-enddate" type="date" class="w-100-m-0" mandatory="" autocomplete="off" style="display: block;">
            </div>
            <div class="w-50-m-0">
              <br>
              <button id="button-fetch-log" part="button-icon" class="material-icons button-icon">receipt_long</button>
            </div>
            <div class="rb"></div>
          </div>
          <div class="d-flex justify-center">
            <div class="loader-element"></div>
          </div>
          <div class="d-flex">
            <div class="lb"></div>
            <div id="logs-list-container" class="flex-grow"></div>
            <div class="rb"></div>
          </div>
          
        </div>
      
      `;

    } else if(this.mode == "new") {

      return html`
        
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
        <div class="SfITicketingC">
          <div class="d-flex justify-center">
              <h1 part="title">${this.name}</h1>
          </div>
          <div class="d-flex justify-center">
            <div part="badge" class="badge">Create New</div>
          </div>
          <br />
          <div class="d-flex justify-start">
            <div class="lb"></div>
            <button id="button-back" part="button-icon" class="button-icon"><span class="material-icons">keyboard_backspace</span></button>
            <div class="rb"></div>
          </div>
          <br />
          <div class="d-flex justify-center">
            <div class="lb"></div>
            <div class="flex-grow" id="form-container">
              <slot name="form"></slot>
            </div>
            <div class="rb"></div>
          </div>
          <div class="d-flex justify-between">
            <div class="lb"></div>
            <div>
              <div class="div-row-error div-row-submit gone">
                <div part="errormsg" class="div-row-error-message"></div>
              </div>
              <div class="div-row-success div-row-submit gone">
                <div part="successmsg" class="div-row-success-message"></div>
              </div>
            </div>
            <div class="rb"></div>
          </div>
          <br />
          <div class="d-flex justify-center">
            <div class="loader-element"></div>
          </div>
          <div class="d-flex justify-center">
            <div class="lb"></div>
            <div class="d-flex justify-start flex-grow">
              <button part="button-lg" id="button-submit" disabled>Submit</button>
            </div>
            <div class="rb"></div>
          </div>
          
        </div>
      
      `;

    } else if(this.mode == "downloader"){
      return html`
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <div class="SfITicketingC">
        <div class="d-flex justify-center">
            <h1 part="title">${this.name}</h1>
        </div>
        <div id="decrypt-container" class="d-flex flex-col justify-center">
          <div class="d-flex mb-10">
            <div class="lb" part="lb"></div>
            <div class="d-flex align-end justify-between flex-grow">
              <div class="d-flex flex-col">
                <sf-i-form id="sf-i-project-decrypt" name="Projects" label="Select Project *" apiid="dnytrdlrmxgsy.cloudfront.net/project" mode="multiselect-dropdown" selectprojection="name" searchphrase="" ignoreprojections="[&quot;locations&quot;,&quot;plan&quot;,&quot;logo&quot;,&quot;shortid&quot;,&quot;plan&quot;]" mandatory="">
                </sf-i-form>
              </div>
              <div class="d-flex flex-col">
                <label>Decrypt Utility</label>
                <div class="d-flex align-end">
                  <input part="input" id="input-decrypt" type="text" placeholder="file key" />.json&nbsp;&nbsp;
                  <button id="button-decrypt" part="button-icon" class="material-icons button-icon" disabled>download</button>
                </div>
                <div class="loader-element"></div>
              </div>
            </div>
            <div class="rb" part="rb"></div>
          </div>
          <div class="d-flex justify-center">
            <div class="lb" part="lb"></div>
            <div class="d-flex flex-col">
              <div class="d-flex justify-center gone">
              </div>
              <div class="div-row-error div-row-submit gone">
                <div part="errormsg" class="div-row-error-message"></div>
              </div>
              <div class="div-row-success div-row-submit">
                <div part="successmsg" class="div-row-success-message"></div>
              </div>
              <div class="div-row-notif div-row-submit">
                <div part="notifmsg" class="div-row-notif-message"></div>
              </div>
            </div>
            <div class="rb" part="rb"></div>
          </div>
        </div>
        
      </div>
      `
    }else if(this.mode == "view") {

      return html`
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <div class="SfITicketingC">
          <div class="d-flex justify-center">
              <h1 part="title">${this.name}</h1>
          </div>
          <div id="search-badge" class="d-flex justify-center">
            <div part="badge" class="badge">Search</div>
          </div>
          <br />
          <div class="d-flex" id="search-filters-container">
            <div class="lb" part="lb"></div>
            <div class="d-flex align-stretch justify-between flex-col">
              <div class="d-flex align-center justify-between flex-grow row-gap-5 flex-wrap">
                <sf-i-form part="search-project" id="search-project" class="search-input" name="Project" label="Project" apiid="dnytrdlrmxgsy.cloudfront.net/project" mode="multiselect-dropdown" searchphrase="" selectprojection="name"></sf-i-form>
                <sf-i-form part="search-initiator" id="search-initiator" class="search-input" name="Initiator" label="Initiator" apiid="dnytrdlrmxgsy.cloudfront.net/userprofile" mode="multiselect-dropdown" searchphrase="" selectprojection="name"></sf-i-form>
                <sf-i-form part="search-assignedto" id="search-assignedto" class="search-input" name="FlaggGRC Administrator" label="FlaggGRC Administrator" apiid="dnytrdlrmxgsy.cloudfront.net/userprofile" mode="multiselect-dropdown" searchphrase="" selectprojection="name"></sf-i-form>
              </div>
              <div class="d-flex align-center justify-between flex-grow row-gap-5 flex-wrap">
                <div class="search-input d-flex flex-col justify-center align-stretch">
                  <label>Category</label>
                  <div class="d-flex w-100-m-0">
                    <select class="w-100" part="input-select" id="search-category"><option value="noselect" disable="" hidden="">Select</option></select>
                  </div>
                </div>
                <div class="search-input d-flex flex-col justify-center align-stretch">
                  <label>Priority</label>
                  <div class="d-flex w-100-m-0">
                    <select class="w-100" part="input-select" id="search-priority"><option value="noselect" disable="" hidden="">Select</option></select>
                  </div>
                </div>
                <div class="search-input d-flex flex-col justify-center align-stretch">
                  <label>Status</label>
                  <div class="d-flex w-100-m-0">
                    <select class="w-100" part="input-select" id="search-status"><option value="noselect" disable="" hidden="">Select</option></select>
                  </div>
                </div>
              </div>
            </div>
            <div class="rb" part="rb"></div>
          </div>
          <div class="d-flex">
            <div class="lb" part="lb"></div>
            <div class="d-flex align-end justify-between flex-grow">
              <div class="d-flex flex-col" part="date-filter-container">
                <div class="d-flex align-end">
                  <div class="w-50-m-0" part="date-input-container">
                    <label part="input-label">From Date *</label><br>
                    <input part="input" id="search-startdate" type="date" class="w-100-m-0" mandatory="" autocomplete="off" style="display: block;">
                  </div>
                  <div class="w-50-m-0" part="date-input-container">
                    <label part="input-label">To Date *</label><br>
                    <input part="input" id="search-enddate" type="date" class="w-100-m-0" mandatory="" autocomplete="off" style="display: block;">
                  </div>&nbsp;&nbsp;
                  <button id="button-all" part="button-icon" class="material-icons button-icon">filter_list</button>
                </div>
                <div class="loader-element"></div>
              </div>
              <div class="d-flex">
                <button id="button-new" part="button-icon" class="material-icons button-icon">add</button>
              </div>
            </div>
            <div class="rb" part="rb"></div>
          </div>
          <div class="d-flex justify-center">
            <div class="lb" part="lb"></div>
            <div class="d-flex flex-col">
              <div class="d-flex justify-center gone">
              </div>
              <div class="div-row-error div-row-submit gone">
                <div part="errormsg" class="div-row-error-message"></div>
              </div>
              <div class="div-row-success div-row-submit">
                <div part="successmsg" class="div-row-success-message"></div>
              </div>
              <div class="div-row-notif div-row-submit">
                <div part="notifmsg" class="div-row-notif-message"></div>
              </div>
            </div>
            <div class="rb" part="rb"></div>
          </div>
          <div class="d-flex">
            <div class="lb" part="lb"></div>
            <div id="search-list-container" class="flex-grow"></div>
            <div class="rb" part="rb"></div>
          </div>
        </div>
      `;

    } else if(this.mode == "text") {

      return html`
        <div class="SfITicketingC">
          <div>${this.selectedTextPhrase}<div class="loader-element"></div></div>
        </div>
      `;
      
    } else if(this.mode == "detail" || this.mode == "consumer") {

      return html`
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
        <div class="SfITicketingC">
          <div class="d-flex justify-center">
              <h1 part="title">${this.name}</h1>
          </div>
          <div class="d-flex justify-center">
            <div part="badge" class="badge">View Detail</div>
          </div>
          <br />
          <div class="d-flex">
            <div class="lb"></div>
            <div class="d-flex flex-grow justify-between">
              <button id="button-back" part="button-icon" class="button-icon"><span class="material-icons">keyboard_backspace</span></button>
              <div class="d-flex">
                <button id="button-calendar" part="button-icon" class="button-icon hide"><span class="material-icons">calendar_month</span></button>
                <button id="button-calendar-cancel" part="button-icon" class="button-icon hide"><span class="material-icons">close</span></button>
                <button id="button-edit" part="button-icon" class="button-icon"><span class="material-icons">edit</span></button>
                <button id="button-edit-cancel" part="button-icon" class="button-icon"><span class="material-icons">edit_off</span></button>
              </div>
            </div>
            <div class="rb"></div>
          </div>
          <br />
          <div class="d-flex justify-center">
            <div class="lb"></div>
            <div class="flex-grow" id="form-container">
              <slot name="form"></slot>
            </div>
            <div class="rb"></div>
          </div>
          <div class="d-flex justify-center">
            <div class="lb"></div>
            <div class="flex-grow flexpcol hide" part="calendar-container" id="calendar-container">
              <div><h3 part="results-title"  class="text-center">Compliance Calendar</h3></div>
              <slot name="calendar"></slot>
            </div>
            <div class="rb"></div>
          </div>
          <div class="d-flex justify-between">
            <div class="lb"></div>
            <div>
              <div class="div-row-error div-row-submit gone">
                <div part="errormsg" class="div-row-error-message"></div>
              </div>
              <div class="div-row-success div-row-submit gone">
                <div part="successmsg" class="div-row-success-message"></div>
              </div>
              <div class="div-row-notif div-row-submit">
                <div part="notifmsg" class="div-row-notif-message"></div>
              </div>
            </div>
            <div class="rb"></div>
          </div>
          <br />
          <div class="d-flex justify-center">
            <div class="loader-element"></div>
          </div>
          <div class="d-flex justify-center">
            <div class="lb"></div>
            <div class="d-flex justify-center flex-grow">
              <button part="button-lg" id="button-submit" disabled>Submit</button>
            </div>
            <div class="rb"></div>
          </div>
          
        </div>
      `;
      
      
    } else {

      return html`
        <div class="SfITicketingC">
          <div class="d-flex justify-center">
            <div class="lb"></div>
            <div class="d-flex flex-col">
              <slot name="form"></slot>
              <div class="div-row-error div-row-submit">
                <div part="errormsg" class="div-row-error-message"></div>
              </div>
              <div class="div-row-success div-row-submit">
                <div part="successmsg" class="div-row-success-message"></div>
              </div>
              <div class="d-flex justify-center">
                <div class="loader-element"></div>
              </div>
             
            </div>
            <div class="rb"></div>
          </div>
        </div>
      `;

    }
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'sf-i-ticketing': SfITicketing;
  }
}

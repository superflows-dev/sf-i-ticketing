/**
 * @license
 * Copyright 2022 Superflow.dev
 * SPDX-License-Identifier: MIT
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, query, queryAssignedElements, property } from 'lit/decorators.js';
// import {customElement, query, property} from 'lit/decorators.js';
import Util from './util';
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
let SfITicketing = class SfITicketing extends LitElement {
    constructor() {
        super();
        this.searchPhraseOriginal = "";
        this.blockSize = 10;
        this.VALIDATION_TEXT_BASIC = "text-basic";
        this.VALIDATION_TEXT_DATE = "text-date";
        this.VALIDATION_SELECT = "select";
        this.flow = "";
        this.showCalendar = false;
        this.searchPhrase = "";
        this.ignoreProjections = "[]";
        this.getIgnoreProjections = () => {
            try {
                return JSON.parse(this.ignoreProjections);
            }
            catch (e) {
                return [];
            }
        };
        this.dependencies = "[]";
        this.inputIds = "[]";
        this.fields = "[]";
        this.validations = "[]";
        this.selectedViewToDetailValues = "[]";
        this.useInApi = "[]";
        this.unitFiltersNew = "[]";
        this.unitFiltersDetail = "[]";
        this.apiIdCalendarDetail = "";
        this.selectedSearchId = [];
        this.searchParams = {};
        this.searchInputIds = "[]";
        this.adminProfileShortcode = "";
        this.getPreselectedValues = () => {
            try {
                return JSON.parse(this.preselectedValues);
            }
            catch (e) {
                return [];
            }
        };
        this.latestDaysBlock = 7;
        this.shortlistedSearchPhrases = {};
        this.removedValues = [];
        this.selectedTextPhrase = "";
        this.projectField = "";
        this.prevCursor = [];
        this.nextCursor = [];
        this.noLatestMessage = "";
        this.titleMessage = "";
        this.multiselectArr = [];
        this.decryptProjectId = "";
        this.decryptFileName = "";
        this.selectedValues = () => {
            if (this.mode == "multiselect-dropdown") {
                const values = [];
                var divArr = this._SfSearchMultiselectSelected.querySelectorAll('div');
                for (var i = 0; i < divArr.length; i++) {
                    values.push(divArr[i].innerHTML);
                }
                return values;
            }
            else if (this.mode == "list" || this.mode == "select") {
                const values = [];
                const checkboxes = this._SfSearchSelectContainer.querySelectorAll('input');
                const len = checkboxes.length;
                for (var i = 0; i < len; i++) {
                    const cb = checkboxes[i];
                    if (cb.checked) {
                        values.push(cb.value);
                    }
                }
                return values;
            }
            else {
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
        };
        this.selectedTexts = () => {
            if (this.mode == "multiselect-dropdown") {
                const values = [];
                var divArr = this._SfSearchMultiselectSelected.querySelectorAll('div');
                for (var i = 0; i < divArr.length; i++) {
                    values.push(divArr[i].innerHTML);
                }
                return values;
            }
            if (this.mode == "list" || this.mode == "select") {
                const values = [];
                const checkboxes = this._SfSearchSelectContainer.querySelectorAll('input');
                const divs = this._SfSearchSelectContainer.querySelectorAll('.append-str');
                const len = divs.length;
                for (var i = 0; i < len; i++) {
                    const div = divs[i];
                    const cb = checkboxes[i];
                    if (cb.checked) {
                        values.push(div.innerHTML);
                    }
                }
                return values;
            }
            else {
                const values = [];
                const len = this._sfInputSelect.options.length;
                for (var i = 0; i < len; i++) {
                    const opt = this._sfInputSelect.options[i];
                    if (opt.selected && opt.value != "noselect") {
                        values.push(this._sfInputSelect.options[i].text);
                    }
                }
                return values;
            }
        };
        this.searchFilterIds = ["search-project", "search-initiator", "search-assignedto", "search-category", "search-priority", "search-status"];
        this.getInputFromField = (field) => {
            for (var i = 0; i < this.getFields().length; i++) {
                if (field == this.getFields()[i]) {
                    return this.getInputs()[i];
                }
            }
        };
        this.getFieldFromInput = (input) => {
            for (var i = 0; i < this.getInputs().length; i++) {
                if (input == this.getInputs()[i]) {
                    return this.getFields()[i];
                }
            }
        };
        this.getUseInApi = () => {
            return JSON.parse(this.useInApi);
        };
        this.getUnitFiltersNew = () => {
            return JSON.parse(this.unitFiltersNew);
        };
        this.getUnitFiltersDetail = () => {
            return JSON.parse(this.unitFiltersDetail);
        };
        this.getSelectedViewToDetailValues = () => {
            return JSON.parse(this.selectedViewToDetailValues);
        };
        this.getFields = () => {
            return JSON.parse(this.fields);
        };
        this.getValidations = () => {
            return JSON.parse(this.validations);
        };
        this.getDependencies = () => {
            return JSON.parse(this.dependencies);
        };
        this.getInputs = () => {
            return JSON.parse(this.inputIds);
        };
        this.dispatchMyEvent = (ev, args) => {
            console.log('dispatching event', ev, args);
            const event = new CustomEvent(ev, { detail: args, bubbles: true, composed: true });
            this.dispatchEvent(event);
        };
        this.onChangeSelect = (ev) => {
            this.dispatchMyEvent("valueChanged", { newValue: ev.target.value, newText: ev.target.options[ev.target.selectedIndex].text });
            // console.log('change', this.selectedListSearchItemsTexts, this.selectedListSearchItemsValues);
        };
        this.clearSelection = () => {
            // if(this.mode == "select") {
            //   this._sfInputSelect.value = 'noselect';
            // }
            // if(this.mode == "list") {
            //   this._sfInputList.value = 'noselect';
            // }
        };
        // getSelectedSearchId = () => {
        //   return this.selectedSearchId;
        // }
        // getSelectedSearchValue = () => {
        //   return (this._sfInputSelect as HTMLSelectElement).value;
        // }
        this.getSelectedSearchText = () => {
            if (this._sfInputSelect.selectedIndex >= 0) {
                return this._sfInputSelect.options[this._sfInputSelect.selectedIndex].text;
            }
            else {
                return null;
            }
        };
        this.getInputValue = (id) => {
            console.log('id', this._SfFormC, this._SfFormC[0].querySelector('#' + id).tagName);
            console.log('field getuseapi', this.getUseInApi());
            var value = null;
            if (this._SfFormC[0].querySelector('#' + id).tagName.toLowerCase() == "sf-i-select") {
                if (this._SfFormC[0].querySelector('#' + id).style.display == "none") {
                    if (this.getUseInApi().includes(this.getFieldFromInput(id))) {
                        value = {
                            type: "sf-i-select",
                            value: this._SfFormC[0].querySelector('#' + id).selectedValues(),
                            text: this._SfFormC[0].querySelector('#' + id).selectedTexts()
                        };
                    }
                    else {
                        value = {
                            type: "sf-i-select",
                            value: [],
                            text: []
                        };
                    }
                }
                else {
                    value = {
                        type: "sf-i-select",
                        value: this._SfFormC[0].querySelector('#' + id).selectedValues(),
                        text: this._SfFormC[0].querySelector('#' + id).selectedTexts()
                    };
                }
            }
            else if (this._SfFormC[0].querySelector('#' + id).tagName.toLowerCase() == "sf-i-sub-select") {
                if (this._SfFormC[0].querySelector('#' + id).style.display == "none") {
                    if (this.getUseInApi().includes(this.getFieldFromInput(id))) {
                        value = {
                            type: "sf-i-sub-select",
                            value: this._SfFormC[0].querySelector('#' + id).selectedValues(),
                            text: this._SfFormC[0].querySelector('#' + id).selectedTexts()
                        };
                    }
                    else {
                        value = {
                            type: "sf-i-sub-select",
                            value: [],
                            text: []
                        };
                    }
                }
                else {
                    value = {
                        type: "sf-i-sub-select",
                        value: this._SfFormC[0].querySelector('#' + id).selectedValues(),
                        text: this._SfFormC[0].querySelector('#' + id).selectedTexts()
                    };
                }
            }
            else if (this._SfFormC[0].querySelector('#' + id).tagName.toLowerCase() == "sf-i-form") {
                if (this._SfFormC[0].querySelector('#' + id).style.display == "none") {
                    if (this.getUseInApi().includes(this.getFieldFromInput(id))) {
                        value = {
                            type: "sf-i-form",
                            value: this._SfFormC[0].querySelector('#' + id).selectedValues(),
                            text: this._SfFormC[0].querySelector('#' + id).selectedTexts()
                        };
                    }
                    else {
                        value = {
                            type: "sf-i-form",
                            value: [],
                            text: []
                        };
                    }
                }
                else {
                    value = {
                        type: "sf-i-form",
                        value: this._SfFormC[0].querySelector('#' + id).selectedValues(),
                        text: this._SfFormC[0].querySelector('#' + id).selectedTexts()
                    };
                }
            }
            else if (this._SfFormC[0].querySelector('#' + id).tagName.toLowerCase() == "sf-i-uploader") {
                if (this._SfFormC[0].querySelector('#' + id).style.display == "none") {
                    if (this.getUseInApi().includes(this.getFieldFromInput(id))) {
                        value = {
                            type: "sf-i-uploader",
                            value: this._SfFormC[0].querySelector('#' + id).selectedValues(),
                            text: this._SfFormC[0].querySelector('#' + id).selectedTexts()
                        };
                    }
                    else {
                        value = {
                            type: "sf-i-uploader",
                            value: [],
                            text: []
                        };
                    }
                }
                else {
                    value = {
                        type: "sf-i-uploader",
                        value: this._SfFormC[0].querySelector('#' + id).selectedValues(),
                        text: this._SfFormC[0].querySelector('#' + id).selectedTexts()
                    };
                }
            }
            else if (this._SfFormC[0].querySelector('#' + id).tagName.toLowerCase() == "select") {
                if (this._SfFormC[0].querySelector('#' + id).style.display == "none") {
                    if (this.getUseInApi().includes(this.getFieldFromInput(id))) {
                        value = {
                            type: "select",
                            value: this._SfFormC[0].querySelector('#' + id).value,
                            text: this._SfFormC[0].querySelector('#' + id).options[this._SfFormC[0].querySelector('#' + id).selectedIndex].text
                        };
                    }
                    else {
                        value = {
                            type: "select",
                            value: "",
                            text: ""
                        };
                    }
                }
                else {
                    value = {
                        type: "select",
                        value: this._SfFormC[0].querySelector('#' + id).value,
                        text: this._SfFormC[0].querySelector('#' + id).options[this._SfFormC[0].querySelector('#' + id).selectedIndex].text
                    };
                }
            }
            else {
                if (this._SfFormC[0].querySelector('#' + id).style.display == "none") {
                    if (this.getUseInApi().includes(this.getFieldFromInput(id))) {
                        value = (this._SfFormC[0].querySelector('#' + id)).value;
                        value = {
                            type: "input",
                            value: (this._SfFormC[0].querySelector('#' + id)).value
                        };
                    }
                    else {
                        value = (this._SfFormC[0].querySelector('#' + id)).value;
                        value = {
                            type: "input",
                            value: ""
                        };
                    }
                }
                else {
                    value = (this._SfFormC[0].querySelector('#' + id)).value;
                    value = {
                        type: "input",
                        value: (this._SfFormC[0].querySelector('#' + id)).value
                    };
                }
            }
            return value;
        };
        this.prepareXhr = async (data, url, loaderElement, authorization) => {
            if (loaderElement != null) {
                loaderElement.innerHTML = '<div class="lds-dual-ring"></div>';
            }
            return await Util.callApi(url, data, authorization);
        };
        this.clearMessages = () => {
            this._SfRowError.style.display = 'none';
            this._SfRowErrorMessage.innerHTML = '';
            this._SfRowSuccess.style.display = 'none';
            this._SfRowSuccessMessage.innerHTML = '';
        };
        this.setError = (msg) => {
            this._SfRowError.style.display = 'flex';
            this._SfRowErrorMessage.innerHTML = msg;
            this._SfRowSuccess.style.display = 'none';
            this._SfRowSuccessMessage.innerHTML = '';
            // this._SfRowNotif.style.display = 'none';
            // this._SfRowNotifMessage.innerHTML = '';
        };
        this.setSuccess = (msg) => {
            this._SfRowError.style.display = 'none';
            this._SfRowErrorMessage.innerHTML = '';
            this._SfRowSuccess.style.display = 'flex';
            this._SfRowSuccessMessage.innerHTML = msg;
            // this._SfRowNotif.style.display = 'none';
            // this._SfRowNotifMessage.innerHTML = '';
        };
        this.setNotif = (msg) => {
            this._SfRowError.style.display = 'none';
            this._SfRowErrorMessage.innerHTML = '';
            this._SfRowSuccess.style.display = 'none';
            this._SfRowSuccessMessage.innerHTML = '';
            this._SfRowNotif.style.display = 'flex';
            this._SfRowNotifMessage.innerHTML = msg;
        };
        this.setListSelection = (value, text) => {
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
            this.dispatchMyEvent("valueChanged", { newValue: value, newText: text });
            // console.log(this.selectedListSearchItemsTexts, this.selectedListSearchItemsValues);
        };
        this.clickTableNextList = (cursor) => {
            this.prevCursor.push(this.prevCursor.length === 0 ? 'initial' : this.nextCursor[this.nextCursor.length - 1]);
            this.nextCursor.push(cursor);
            this.fetchSearchSelect(this.nextCursor[this.nextCursor.length - 1]);
        };
        this.clickTableNext = (cursor) => {
            this.prevCursor.push(this.prevCursor.length === 0 ? 'initial' : this.nextCursor[this.nextCursor.length - 1]);
            this.nextCursor.push(cursor);
            this.fetchSearch(this.nextCursor[this.nextCursor.length - 1]);
        };
        this.clickTablePrev = () => {
            if (this.nextCursor.length > 0) {
                this.nextCursor.pop();
                this.prevCursor.pop();
            }
            console.log('clicked prev', this.prevCursor, this.nextCursor);
            if (this.nextCursor.length > 1) {
                this.fetchSearch(this.nextCursor[this.nextCursor.length - 1]);
            }
            else {
                this.fetchSearch();
            }
        };
        this.renderSearch = (values) => {
            let html = '';
            if (values.length > 0) {
                html += '<h3 part="results-title" class="left-sticky">Search Results (' + values.length + ')</h3>';
                html += '<table>';
                html += '<thead>';
                html += '</thead>';
                for (var i = 0; i < values.length; i++) {
                    // const cols = JSON.parse(values[i].fields.cols);
                    const cols = Object.keys(values[i]);
                    // console.log(JSON.parse(values[i].fields.data));
                    let data = Object.values(values[i]);
                    var classBg = "";
                    if (i % 2 === 0) {
                        classBg = 'td-light';
                    }
                    else {
                        classBg = 'td-dark';
                    }
                    html += '<tr>';
                    html += '<td part="td-action" class="left-sticky">';
                    html += '<div id="search-' + i + '"><button part="button" class="button-search-view">View</button></div>';
                    html += '</td>';
                    html += '<td part="td-body" class="td-body ' + classBg + '">';
                    html += ('<div part="row-col-title">id</div>');
                    html += ('<sf-i-elastic-text text="' + values[i].id + '" minLength="10"></sf-i-elastic-text>');
                    html += '</td>';
                    for (var j = 0; j < cols.length; j++) {
                        console.log('getignoreprojects', this.getIgnoreProjections());
                        if (!this.getIgnoreProjections().includes(cols[j])) {
                            html += '<td part="td-body" class="td-body ' + classBg + '">';
                            html += ('<div part="row-col-title">' + cols[j] + '</div>');
                            if (Array.isArray(data[j])) {
                                console.log("isArray", cols[j]);
                                if (data[j][0] != null && Util.isJsonString(data[j][0]) && JSON.parse(data[j][0])['key'] != null && JSON.parse(data[j][0])['ext'] != null) {
                                    html += ('<sf-i-elastic-text text="files[' + data[j].length + ']" minLength="20"></sf-i-elastic-text>');
                                }
                                else {
                                    for (var k = 0; k < data[j].length; k++) {
                                        html += ('<sf-i-elastic-text text="' + data[j][k] + '" minLength="20"></sf-i-elastic-text>');
                                        if (k < (data[j].length - 1)) {
                                            html += "; ";
                                        }
                                    }
                                }
                            }
                            else if (Object.keys(data[j]).length > 1 && data[j]['text'] != null) {
                                console.log('object.keys', cols[j], Object.keys(data[j]).length);
                                html += ('<sf-i-elastic-text text="' + data[j]['text'] + '" minLength="20"></sf-i-elastic-text>');
                            }
                            else if (!isNaN(data[j])) {
                                html += ('<sf-i-elastic-text text="' + (new Date(parseInt(data[j])).toLocaleDateString()) + "-" + (new Date(parseInt(data[j])).toLocaleTimeString()) + '" minLength="50"></sf-i-elastic-text>');
                            }
                            else {
                                html += ('<sf-i-elastic-text text="' + data[j] + '" minLength="20"></sf-i-elastic-text>');
                            }
                            html += '</td>';
                        }
                    }
                    html += '</tr>';
                }
                html += '</table>';
                this._SfSearchListContainer.innerHTML = html;
                for (var i = 0; i < values.length; i++) {
                    //console.log(this._SfSearchListContainer.querySelector('#search-' + i))
                    this._SfSearchListContainer.querySelector('#search-' + i).addEventListener('click', (ev) => {
                        console.log('id', ev.currentTarget.id);
                        this.selectedId = values[parseInt((ev.currentTarget.id + "").split('-')[1])].id;
                        this.selectedProjectId = values[parseInt((ev.currentTarget.id + "").split('-')[1])]['project']['value'][0];
                        this.mode = "detail";
                        this.loadMode();
                    });
                }
            }
            else {
                html += '<h3 class="no-records-message" part="no-records-message">No Records Found</h3>';
                this._SfSearchListContainer.innerHTML = html;
            }
        };
        this.renderListRows = (values, multiSelect) => {
            console.log('renderlistrows', values);
            var html = '';
            for (var i = 0; i < values.length; i++) {
                let data = JSON.parse(values[i].fields.data);
                let cols = JSON.parse(values[i].fields.cols);
                var classBg = "";
                if (i % 2 === 0) {
                    classBg = 'td-light';
                }
                else {
                    classBg = 'td-dark';
                }
                var appendStr = "";
                for (var j = 0; j < cols.length; j++) {
                    // console.log('data[j]', data[j]);
                    if (!this.getIgnoreProjections().includes(cols[j])) {
                        if (Array.isArray(data[j])) {
                            for (var k = 0; k < data[j].length; k++) {
                                appendStr += (data[j][k] + " ");
                                if (k < (data[j].length - 1)) {
                                    appendStr += "";
                                }
                            }
                        }
                        else {
                            appendStr += (data[j] + " ");
                        }
                    }
                    //console.log('append', appendStr);
                }
                var checked = '';
                if (this.selectedSearchId.includes(values[i].id)) {
                    checked = "checked";
                }
                else {
                    checked = "";
                }
                var disabled = '';
                if (this.flow == "read") {
                    disabled = 'disabled';
                }
                if (this.flow == "read" && checked != "checked") {
                    continue;
                }
                html += '<tr>';
                html += '<td part="td-action" class="left-sticky">';
                if (multiSelect) {
                    html += '<div><input id="search-' + i + '" part="input-checkbox" type="checkbox" value="' + values[i].id + '" ' + checked + ' ' + disabled + '/><div class="append-str gone">' + appendStr + '</div></div>';
                }
                else {
                    html += '<div><input id="search-' + values[i].id + '" class="search-select-input" name="select-statute" part="input-checkbox" type="radio" value="' + values[i].id + '" ' + checked + ' ' + disabled + '/><div class="append-str gone">' + appendStr + '</div></div>';
                }
                html += '</td>';
                for (j = 0; j < cols.length; j++) {
                    // console.log('data', data[j]);
                    if (!this.getIgnoreProjections().includes(cols[j])) {
                        html += '<td part="td-body" class="td-body ' + classBg + '">';
                        if (Array.isArray(data[j])) {
                            if (data[j][0] != null && Util.isJsonString(data[j][0]) && JSON.parse(data[j][0])['key'] != null && JSON.parse(data[j][0])['ext'] != null) {
                                html += 'files[' + data[j].length + ']';
                            }
                            else {
                                for (var k = 0; k < data[j].length; k++) {
                                    html += data[j][k];
                                    if (k < (data[j].length - 1)) {
                                        html += " &nbsp; ";
                                    }
                                }
                            }
                        }
                        else {
                            html += data[j];
                        }
                        html += '</td>';
                    }
                }
                html += '</tr>';
            }
            return html;
        };
        this.renderList = (values, found, cursor, multiSelect = false) => {
            var _a, _b, _c;
            console.log('renderlist', values, this.nextCursor);
            let html = '';
            if (values.length > 0 && this.nextCursor.length === 0) {
                if (this.flow != "read") {
                    html += '<h3 part="results-title" class="left-sticky">Search Results (' + found + ')</h3>';
                }
                html += '<table id="select-list-table">';
                //console.log('search', values)
                const cols = JSON.parse(values[0].fields.cols);
                html += '<thead>';
                html += '<th part="td-action" class="td-head left-sticky">';
                html += 'Action';
                html += '</th>';
                for (var i = 0; i < cols.length; i++) {
                    if (!this.getIgnoreProjections().includes(cols[i])) {
                        html += '<th part="td-head" class="td-head">';
                        html += cols[i];
                        html += '</th>';
                    }
                }
                html += '</thead>';
                html += this.renderListRows(values, multiSelect);
                html += '</table>';
                if (values.length === this.blockSize && this.flow != "read") {
                    html += '<div id="down-indicator" class="d-flex justify-start align-center mt-10 left-sticky">';
                    html += '<span part="td-head" id="page-num">&nbsp;&nbsp;' + (this.prevCursor.length + 1) + "/" + (Math.ceil(parseInt(found) / this.blockSize)) + '&nbsp;&nbsp;</span>';
                    html += '<button id="button-next-cursor" part="button-icon-small" class="material-icons">expand_more</button>&nbsp;&nbsp;';
                    html += '</div>';
                }
                this._SfSearchSelectContainer.innerHTML = html;
                const inputElements = this._SfSearchSelectContainer.querySelectorAll('.search-select-input');
                console.log('inputs', inputElements);
                for (var i = 0; i < inputElements.length; i++) {
                    inputElements[i].addEventListener('click', () => {
                        //console.log('event', (ev.currentTarget as HTMLInputElement).id);
                        this.dispatchMyEvent("valueChanged", { newValue: {}, newText: {} });
                    });
                }
                // for(var i = 0; i < values.length; i++) {
                //  // console.log(this._SfSearchSelectContainer.querySelector('#search-' + i))
                //   this._SfSearchSelectContainer.querySelector('#search-' + i).addEventListener('click', () => {
                //   //  console.log('id', ev.currentTarget.id)
                //     this.dispatchMyEvent("valueChanged", {newValue: {}, newText: {}});
                //   });
                // }
                (_a = this._SfSearchSelectContainer.querySelector('#button-next-cursor')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
                    this.clickTableNextList(cursor);
                });
            }
            else if (values.length > 0 && this.nextCursor.length > 0) {
                this._SfSearchSelectContainer.querySelector('#select-list-table').insertAdjacentHTML('beforeend', this.renderListRows(values, multiSelect));
                this._SfSearchSelectContainer.querySelector('#page-num').innerHTML = '&nbsp;&nbsp;' + (this.prevCursor.length + 1) + "/" + (Math.ceil(parseInt(found) / this.blockSize)) + '&nbsp;&nbsp;';
                if (values.length < this.blockSize) {
                    this._SfSearchSelectContainer.querySelector('#down-indicator').style.display = 'none';
                }
                const inputElements = this._SfSearchSelectContainer.querySelectorAll('.search-select-input');
                for (var i = 0; i < inputElements.length; i++) {
                    inputElements[i].addEventListener('click', () => {
                        //console.log('event', (ev.currentTarget as HTMLInputElement).id);
                        this.dispatchMyEvent("valueChanged", { newValue: {}, newText: {} });
                    });
                }
                var old_element = this._SfSearchSelectContainer.querySelector('#button-next-cursor');
                var new_element = old_element.cloneNode(true);
                (_b = old_element === null || old_element === void 0 ? void 0 : old_element.parentElement) === null || _b === void 0 ? void 0 : _b.replaceChild(new_element, old_element);
                (_c = this._SfSearchSelectContainer.querySelector('#button-next-cursor')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
                    this.clickTableNextList(cursor);
                });
            }
            else {
                html += '<h3>No Records Found</h3>';
                this._SfSearchSelectContainer.innerHTML = html;
            }
        };
        this.renderLogs = (values) => {
            console.log('values', values);
            let html = '';
            if (values.length > 0) {
                html += '<h3 class="left-sticky">Logs Results (' + values.length + ')</h3>';
                for (var i = (values.length - 1); i >= 0; i--) {
                    console.log('timestamp', (new Date(values[i].timestamp)));
                    html += '<table class="left-sticky">';
                    html += '<tr>';
                    html += '<td>';
                    html += '<div><button part="button-icon-small" id="button-collapse-' + i + '" class="material-icons gone button-icon-small">expand_less</button><button part="button-icon-small" id="button-expand-' + i + '" class="material-icons button-icon-small">expand_more</button></div>';
                    html += '</td>';
                    html += '<td>';
                    html += '<div id="search-' + i + '"><strong>' + values[i].message.op + '</strong></div>';
                    html += '</td>';
                    html += '<td>';
                    html += '<div>&nbsp;<strong>' + values[i].message.httpCode + '</strong></div>';
                    html += '</td>';
                    html += '<td>';
                    html += '<div>&nbsp;' + values[i].message.userId + '</div>';
                    html += '</td>';
                    html += '<td>';
                    html += '<div>&nbsp;' + (new Date(values[i].timestamp) + "").split(' (')[0] + '</div>';
                    html += '</td>';
                    html += '</tr>';
                    html += '</table>';
                    html += '<table>';
                    html += '<tr>';
                    html += '<td>';
                    html += '<div id="row-expand-' + i + '" class="gone">';
                    if (values[i].message.delta != null) {
                        const jsonDelta = (values[i].message.delta);
                        console.log("delta", jsonDelta);
                        html += '<div><strong>Delta</strong></div>';
                        html += '<table>';
                        html += '<thead>';
                        for (var j = 0; j < jsonDelta.length; j++) {
                            if (jsonDelta[j].oldValue == jsonDelta[j].newValue) {
                                html += '<th class="td-head">';
                            }
                            else {
                                html += '<th class="td-highlight">';
                            }
                            html += jsonDelta[j].field;
                            html += '</th>';
                        }
                        html += '</thead>';
                        html += '<tr>';
                        for (var j = 0; j < jsonDelta.length; j++) {
                            if (jsonDelta[j].oldValue == jsonDelta[j].newValue) {
                                html += '<td class="td-dark">';
                            }
                            else {
                                html += '<td class="td-highlight">';
                            }
                            html += jsonDelta[j].oldValue;
                            html += '</td>';
                        }
                        html += '</tr>';
                        html += '<tr>';
                        for (var j = 0; j < jsonDelta.length; j++) {
                            if (jsonDelta[j].oldValue == jsonDelta[j].newValue) {
                                html += '<td class="td-light">';
                            }
                            else {
                                html += '<td class="td-highlight">';
                            }
                            html += jsonDelta[j].newValue;
                            html += '</td>';
                        }
                        html += '</tr>';
                        html += '</table>';
                    }
                    const req = JSON.parse(values[i].message.req.body).values;
                    if (req != null) {
                        html += '<div><strong>Request</strong></div>';
                        html += '<table>';
                        html += '<thead>';
                        for (var j = 0; j < Object.keys(req).length; j++) {
                            html += '<th class="td-head">';
                            html += Object.keys(req)[j];
                            html += '</th>';
                        }
                        html += '</thead>';
                        html += '<tr>';
                        for (var j = 0; j < Object.keys(req).length; j++) {
                            html += '<td class="td-light">';
                            html += req[Object.keys(req)[j]].value;
                            html += '</td>';
                        }
                        html += '</tr>';
                        html += '</table>';
                    }
                    else {
                        html += '<strong>Request</strong> - ' + JSON.stringify(values[i].message.req.body) + '<br />';
                    }
                    html += '<strong>Response</strong> - ' + JSON.stringify(values[i].message.resp.body) + '';
                    html += '</div>';
                    html += '</td>';
                    html += '</tr>';
                    html += '</table>';
                }
                this._SfLogsListContainer.innerHTML = html;
                for (var i = 0; i < values.length; i++) {
                    this._SfLogsListContainer.querySelector('#button-expand-' + i).addEventListener('click', (ev) => {
                        const id = ev.currentTarget.id;
                        this._SfLogsListContainer.querySelector('#row-expand-' + id.split('-')[2]).style.display = 'block';
                        this._SfLogsListContainer.querySelector('#button-collapse-' + id.split('-')[2]).style.display = 'block';
                        this._SfLogsListContainer.querySelector('#button-expand-' + id.split('-')[2]).style.display = 'none';
                    });
                    this._SfLogsListContainer.querySelector('#button-collapse-' + i).addEventListener('click', (ev) => {
                        const id = ev.currentTarget.id;
                        this._SfLogsListContainer.querySelector('#row-expand-' + id.split('-')[2]).style.display = 'none';
                        this._SfLogsListContainer.querySelector('#button-collapse-' + id.split('-')[2]).style.display = 'none';
                        this._SfLogsListContainer.querySelector('#button-expand-' + id.split('-')[2]).style.display = 'block';
                    });
                }
            }
            else {
                html += '<h3>No Records Found</h3>';
                this._SfLogsListContainer.innerHTML = html;
            }
        };
        this.renderLatestListRows = (values) => {
            var _a, _b;
            console.log('renderlatestlistrows', values);
            var html = '';
            for (var i = 0; i < values.length; i++) {
                const cols = JSON.parse(values[i].fields.cols);
                // console.log(JSON.parse(values[i].fields.data));
                let data = JSON.parse(values[i].fields.data);
                // let data = Object.values(values[i]);
                // let cols = Object.keys(values[i]);
                // console.log('data', data, cols);
                var classBg = "";
                if (i % 2 === 0) {
                    classBg = 'td-light';
                }
                else {
                    classBg = 'td-dark';
                }
                html += '<tr>';
                for (let j = 0; j < cols.length; j++) {
                    if (!this.getIgnoreProjections().includes(cols[j])) {
                        html += '<td part="td-body" class="td-body ' + classBg + '">';
                        html += ('<div part="row-col-title">' + cols[j] + '</div>');
                        let txt = "";
                        if (Array.isArray(data[j])) {
                            if (data[j] != null && Util.isJsonString(data[j]) && JSON.parse(data[j])['key'] != null && JSON.parse(data[j])['ext'] != null) {
                                txt += 'files[' + data[j].length + ']';
                            }
                            else {
                                for (var k = 0; k < data[j].length; k++) {
                                    txt += data[j][k];
                                    if (k < (data[j].length - 1)) {
                                        txt += " &nbsp; ";
                                    }
                                }
                            }
                        }
                        else {
                            if (data[j] != null && Util.isJsonString(data[j]) && JSON.parse(data[j])[0]['key'] != null && JSON.parse(data[j])[0]['ext'] != null) {
                                txt += 'files[' + (JSON.parse(data[j])).length + ']';
                            }
                            else {
                                txt += (Util.isJsonString((_a = data[j]) !== null && _a !== void 0 ? _a : "") ? JSON.parse(data[j]) : ((_b = data[j]) !== null && _b !== void 0 ? _b : "undef"));
                            }
                        }
                        html += '<sf-i-elastic-text text="' + txt + '" minLength="50" lineSize="5"></sf-i-elastic-text>';
                        html += '</td>';
                    }
                }
                html += '</tr>';
            }
            return html;
        };
        this.renderLatest = (values) => {
            console.log('values', values);
            let html = '';
            if (values.length > 0) {
                html += '<h3 part="latest-title">' + this.titleMessage + '</h3>';
                html += '<table part="latest-list-table" id="latest-list-table">';
                html += this.renderLatestListRows(values);
                html += '</table>';
                this._SfLatestListContainer.innerHTML = html;
            }
            else {
                if (this.noLatestMessage != "") {
                    html += `<h3 part="latest-title">${this.titleMessage}</h3>`;
                    html += `<h3 part="no-latest-title">${this.noLatestMessage}</h3>`;
                }
                this._SfLatestListContainer.innerHTML = html;
            }
        };
        this.renderMastersSearch = (values) => {
            console.log('rendering search values', values);
            if (values.categories != null) {
                let html = `<option value="noselect" disable="" hidden="">Select</option>`;
                for (let categoryid of Object.keys(values.categories)) {
                    html += `<option value="${categoryid}" >${values.categories[categoryid]}</option>`;
                }
                this._SfSearchFiltersContainer.querySelector('#search-category').innerHTML = html;
            }
            if (values.priorities != null) {
                let html = `<option value="noselect" disable="" hidden="">Select</option>`;
                for (let priorityid of Object.keys(values.priorities)) {
                    html += `<option value="${priorityid}" >${values.priorities[priorityid]}</option>`;
                }
                this._SfSearchFiltersContainer.querySelector('#search-priority').innerHTML = html;
            }
            if (values.statuses != null) {
                let html = `<option value="noselect" disable="" hidden="">Select</option>`;
                for (let statusid of Object.keys(values.statuses)) {
                    html += `<option value="${statusid}" >${values.statuses[statusid]}</option>`;
                }
                this._SfSearchFiltersContainer.querySelector('#search-status').innerHTML = html;
            }
            this.populateSearchFilterValues();
        };
        this.renderMasters = async (values) => {
            console.log('values', values);
            if (values.categories != null) {
                let html = `<option value="noselect" disable="" hidden="">Select</option>`;
                for (let categoryid of Object.keys(values.categories)) {
                    html += `<option value="${categoryid}" >${values.categories[categoryid]}</option>`;
                }
                this._sfSlottedForm[0].querySelector('#sf-i-category').innerHTML = html;
            }
            if (values.priorities != null) {
                let html = `<option value="noselect" disable="" hidden="">Select</option>`;
                for (let priorityid of Object.keys(values.priorities)) {
                    html += `<option value="${priorityid}" >${values.priorities[priorityid]}</option>`;
                }
                this._sfSlottedForm[0].querySelector('#sf-i-priority').innerHTML = html;
            }
            if (values.statuses != null) {
                let html = `<option value="noselect" disable="" hidden="">Select</option>`;
                for (let statusid of Object.keys(values.statuses)) {
                    html += `<option value="${statusid}" >${values.statuses[statusid]}</option>`;
                }
                this._sfSlottedForm[0].querySelector('#sf-i-status').innerHTML = html;
            }
            if (this.mode == "new") {
                this.processUnitFiltersNew();
            }
            return;
        };
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
        this.renderDetail = (value) => {
            var sValues = '';
            console.log('selected fields', this.getFields().length);
            sValues += '[';
            for (var i = 0; i < this.getFields().length; i++) {
                if (this.getFields()[i] == "comments") {
                    sValues += '[';
                    for (var j = 0; j < value[this.getFields()[i]].length; j++) {
                        sValues += JSON.stringify(value[this.getFields()[i]][j]['attachment']);
                        console.log('selected added object', sValues);
                        sValues += ",";
                    }
                }
                console.log('selected fields', i, value[this.getFields()[i]]);
                if (value[this.getFields()[i]] != null && Util.isJsonString(value[this.getFields()[i]]) && Array.isArray(JSON.parse(value[this.getFields()[i]]))) {
                    sValues += '[';
                    for (var j = 0; j < JSON.parse(value[this.getFields()[i]]).length; j++) {
                        console.log("selected adding object", JSON.parse(value[this.getFields()[i]])[j], typeof JSON.parse(value[this.getFields()[i]])[j]);
                        if (typeof JSON.parse(value[this.getFields()[i]])[j] == "object") {
                            sValues += JSON.stringify(JSON.parse(value[this.getFields()[i]])[j]);
                            console.log('selected added object', sValues);
                            sValues += ",";
                        }
                        else {
                            sValues += '"';
                            sValues += JSON.parse(value[this.getFields()[i]])[j];
                            sValues += '",';
                        }
                    }
                    sValues = sValues.replace(/(^,)|(,$)/g, "");
                    sValues += '],';
                }
                else {
                    //sValues += '"';
                    sValues += value[this.getFields()[i]] != null ? value[this.getFields()[i]]['value'][0] : '""';
                    //sValues += '",';
                    sValues += ',';
                }
            }
            sValues = sValues.replace(/(^,)|(,$)/g, "");
            sValues += ']';
            console.log('selected values', sValues, value);
            this.selectedViewToDetailValues = sValues;
        };
        this.renderSearchMultiselect = (values) => {
            var html = '';
            html += '<option value="noselect">Select</option>';
            for (var i = 0; i < values.length; i++) {
                const id = values[i].id;
                const cols = JSON.parse(values[i].fields.cols[0]);
                const data = JSON.parse(values[i].fields.data[0]);
                let selectProjectionValue = "";
                let selectAnotherProjectionValue = "";
                for (var j = 0; j < cols.length; j++) {
                    if (cols[j] == this.selectProjection) {
                        selectProjectionValue = Array.isArray(data[j]) ? data[j][0] : data[j];
                    }
                    if (this.selectAnotherProjection != null && this.selectAnotherProjection.length > 0) {
                        if (cols[j] == this.selectAnotherProjection) {
                            selectAnotherProjectionValue = Array.isArray(data[j]) ? data[j][0] : data[j];
                        }
                    }
                }
                if (this.selectAnotherProjection != null && selectAnotherProjectionValue.length > 0) {
                    html += '<option value="' + selectProjectionValue + ';' + id + ';' + selectAnotherProjectionValue + '">' + selectProjectionValue + '</option>';
                }
                else {
                    html += '<option value="' + selectProjectionValue + ';' + id + '">' + selectProjectionValue + '</option>';
                }
            }
            this._SfSearchMultiselectSelect.innerHTML = html;
        };
        this.getSearchFilter = () => {
            let retArr = {};
            if (this.isAdmin()) {
                for (let searchFilterId of this.searchFilterIds) {
                    // console.log('search field', searchFilterId, (this._SfSearchFiltersContainer as HTMLElement).querySelector("#"+searchFilterId)?.tagName)
                    let value = {};
                    if (this._SfSearchFiltersContainer.querySelector('#' + searchFilterId).tagName.toLowerCase() == "sf-i-form") {
                        if (this._SfSearchFiltersContainer.querySelector('#' + searchFilterId).style.display != "none") {
                            value = {
                                type: "sf-i-form",
                                value: this._SfSearchFiltersContainer.querySelector('#' + searchFilterId).selectedValues(),
                                text: this._SfSearchFiltersContainer.querySelector('#' + searchFilterId).selectedTexts()
                            };
                        }
                    }
                    else if (this._SfSearchFiltersContainer.querySelector('#' + searchFilterId).tagName.toLowerCase() == "select") {
                        if (this._SfSearchFiltersContainer.querySelector('#' + searchFilterId).style.display != "none") {
                            value = {
                                type: "select",
                                value: this._SfSearchFiltersContainer.querySelector('#' + searchFilterId).value,
                                text: this._SfSearchFiltersContainer.querySelector('#' + searchFilterId).options[this._SfSearchFiltersContainer.querySelector('#' + searchFilterId).selectedIndex].text
                            };
                        }
                    }
                    console.log('search filter value', value);
                    retArr[searchFilterId] = value;
                }
            }
            else {
                retArr['search-initiator'] =
                    {
                        type: "sf-i-form",
                        value: [this.userid],
                        text: ''
                    };
                retArr['search-assignedto'] =
                    {
                        type: "sf-i-form",
                        value: [this.userid],
                        text: ''
                    };
            }
            return retArr;
        };
        this.fetchSearch = async (cursor = "") => {
            this.clearMessages();
            let values = this.getSearchFilter();
            let startDate = this._SfSearchStartDate.value;
            let endDate = this._SfSearchEndDate.value;
            let startTime = new Date(startDate).getTime();
            let endTime = (new Date(endDate).getTime()) + 1000;
            const body = { "starttime": startTime + "", "endtime": endTime + "", "filters": values, "cursor": cursor };
            this.searchParams = body;
            console.log('search params', JSON.stringify(body));
            // const body: any = {"searchstring": this._sfInputSearch != null ? this._sfInputSearch.value : "", "cursor": cursor};
            let url = "https://" + this.apiId + "/listbyfilters";
            const authorization = btoa(Util.readCookie('email') + ":" + Util.readCookie('accessToken'));
            const xhr = (await this.prepareXhr(body, url, this._SfLoader, authorization));
            this._SfLoader.innerHTML = '';
            if (xhr.status == 200) {
                const jsonRespose = JSON.parse(xhr.responseText);
                console.log(jsonRespose);
                this.renderSearch(jsonRespose.data);
            }
            else {
                const jsonRespose = JSON.parse(xhr.responseText);
                this.setError(jsonRespose.error);
                setTimeout(() => {
                    this.clearMessages();
                }, 5000);
            }
        };
        this.fetchSearchMultiselect = async (cursor = "") => {
            this.clearMessages();
            const body = { "searchstring": this._SfSearchMultiselectInput.value + "&" + this.searchPhrase, "cursor": cursor };
            let url = "https://" + this.apiId + "/list";
            const authorization = btoa(Util.readCookie('email') + ":" + Util.readCookie('accessToken'));
            const xhr = (await this.prepareXhr(body, url, this._SfLoader, authorization));
            this._SfLoader.innerHTML = '';
            if (xhr.status == 200) {
                const jsonRespose = JSON.parse(xhr.responseText);
                console.log('multiselected', jsonRespose);
                this.renderSearchMultiselect(jsonRespose.values);
                //this.renderSearch(jsonRespose.values, jsonRespose.found, jsonRespose.cursor);
            }
            else {
                const jsonRespose = JSON.parse(xhr.responseText);
                this.setError(jsonRespose.error);
            }
        };
        this.fetchSearchSelect = async (cursor = "") => {
            const body = { "searchstring": this.searchPhrase != null ? this.searchPhrase : "", "cursor": cursor };
            console.log(body);
            let url = "https://" + this.apiId + "/list";
            console.log('fetchsearchselect searchphrase', this.searchPhrase);
            if (this.searchPhrase != null) {
                console.log('fetchsearchselect', body);
                const authorization = btoa(Util.readCookie('email') + ":" + Util.readCookie('accessToken'));
                const xhr = (await this.prepareXhr(body, url, this._SfLoader, authorization));
                this._SfLoader.innerHTML = '';
                if (xhr.status == 200) {
                    const jsonRespose = JSON.parse(xhr.responseText);
                    console.log('fetchsearchselect', jsonRespose);
                    console.log(jsonRespose);
                    if (this.mode == "select") {
                        //this.renderSelect(jsonRespose.values);
                        this.renderList(jsonRespose.values, jsonRespose.found, jsonRespose.cursor, false);
                    }
                    else if (this.mode == "list") {
                        this.renderList(jsonRespose.values, jsonRespose.found, jsonRespose.cursor, true);
                    }
                }
                else {
                    // const jsonRespose = JSON.parse(xhr.responseText);
                    // this.setError(jsonRespose.error);
                }
            }
        };
        this.fetchSearchList = async (cursor = "") => {
            const body = { "searchstring": this.searchPhrase, "cursor": cursor };
            let url = "https://" + this.apiId + "/list";
            const authorization = btoa(Util.readCookie('email') + ":" + Util.readCookie('accessToken'));
            const xhr = (await this.prepareXhr(body, url, this._SfLoader, authorization));
            this._SfLoader.innerHTML = '';
            if (xhr.status == 200) {
                const jsonRespose = JSON.parse(xhr.responseText);
                console.log(jsonRespose);
                this.renderList(jsonRespose.values, jsonRespose.found, jsonRespose.cursor);
            }
            else {
                const jsonRespose = JSON.parse(xhr.responseText);
                this.setError(jsonRespose.error);
            }
        };
        this.fetchDetail = async () => {
            const body = { "id": this.selectedId, "projectid": this.selectedProjectId };
            console.log('fetch details body:', body);
            let url = "https://" + this.apiId + "/detail";
            const authorization = btoa(Util.readCookie('email') + ":" + Util.readCookie('accessToken'));
            const xhr = (await this.prepareXhr(body, url, this._SfLoader, authorization));
            this._SfLoader.innerHTML = '';
            if (xhr.status == 200) {
                console.log('details response', xhr.responseText);
                const jsonRespose = JSON.parse(xhr.responseText);
                console.log('detail', jsonRespose);
                if (this.mode == "text") {
                    return jsonRespose.data.value[this.projectField].replace(/"/g, '');
                }
                else {
                    this.selectedTicketDetails = jsonRespose.data;
                    // this.renderDetail(jsonRespose.data);
                }
            }
            else {
                const jsonRespose = JSON.parse(xhr.responseText);
                this.setError(jsonRespose.error);
            }
            return null;
        };
        this.fetchLogs = async () => {
            let startDate = this._SfInputStartDate.value;
            let endDate = this._SfInputEndDate.value;
            let startTime = new Date(startDate).getTime();
            let endTime = (new Date(endDate).getTime()) + 1000;
            const body = { "starttime": startTime + "", "endtime": endTime + "" };
            console.log(body);
            let url = "https://" + this.apiId + "/logs";
            const authorization = btoa(Util.readCookie('email') + ":" + Util.readCookie('accessToken'));
            const xhr = (await this.prepareXhr(body, url, this._SfLoader, authorization));
            this._SfLoader.innerHTML = '';
            if (xhr.status == 200) {
                const jsonRespose = JSON.parse(xhr.responseText);
                console.log(jsonRespose);
                this.renderLogs(jsonRespose.data);
            }
            else {
                const jsonRespose = JSON.parse(xhr.responseText);
                this.setError(jsonRespose.error);
            }
        };
        this.fetchLatest = async () => {
            let endTime = new Date().getTime();
            let startTime = endTime - (this.latestDaysBlock * 24 * 60 * 60 * 1000);
            const body = { "starttime": startTime + "", "endtime": endTime + "" };
            console.log(body);
            let url = "https://" + this.apiId + "/getlatestlist";
            const authorization = btoa(Util.readCookie('email') + ":" + Util.readCookie('accessToken'));
            const xhr = (await this.prepareXhr(body, url, this._SfLoader, authorization));
            this._SfLoader.innerHTML = '';
            if (xhr.status == 200) {
                const jsonRespose = JSON.parse(xhr.responseText);
                console.log(jsonRespose);
                this.renderLatest(jsonRespose.data);
            }
            else {
                const jsonRespose = JSON.parse(xhr.responseText);
                this.setError(jsonRespose.error);
            }
        };
        this.fetchMasters = async (successCallback) => {
            let endTime = new Date().getTime();
            let startTime = endTime - (this.latestDaysBlock * 24 * 60 * 60 * 1000);
            const body = { "starttime": startTime + "", "endtime": endTime + "" };
            console.log(body);
            let url = "https://" + this.apiId + "/getmasters";
            const authorization = btoa(Util.readCookie('email') + ":" + Util.readCookie('accessToken'));
            const xhr = (await this.prepareXhr(body, url, this._SfLoader, authorization));
            this._SfLoader.innerHTML = '';
            if (xhr.status == 200) {
                const jsonRespose = JSON.parse(xhr.responseText);
                console.log("masters", jsonRespose);
                await successCallback(jsonRespose.data.value);
            }
            else {
                const jsonRespose = JSON.parse(xhr.responseText);
                this.setError(jsonRespose.error);
            }
        };
        this.submitDelete = async () => {
            this.clearMessages();
            const body = {};
            let url = "";
            body["id"] = this.selectedId;
            url = "https://" + this.apiId + "/delete";
            const authorization = btoa(Util.readCookie('email') + ":" + Util.readCookie('accessToken'));
            const xhr = (await this.prepareXhr(body, url, this._SfLoader, authorization));
            this._SfLoader.innerHTML = '';
            if (xhr.status == 200) {
                this.setSuccess('Operation Successful!');
                setTimeout(() => {
                    this.clearMessages();
                    this._SfButtonBack.dispatchEvent(new Event('click'));
                }, 2000);
            }
            else {
                const jsonRespose = JSON.parse(xhr.responseText);
                this.setError(jsonRespose.error);
            }
        };
        this.submitNew = async () => {
            this.clearMessages();
            console.log('submitNew called');
            const body = {};
            let url = "https://" + this.apiId + "/create";
            const values = {};
            for (var i = 0; i < this.getFields().length; i++) {
                const field = this.getFields()[i];
                if (field == "comments") {
                    if (values[field] == null) {
                        values[field] = [];
                    }
                    let content = this.getInputValue('sf-i-comment-content');
                    let attachment = this.getInputValue('sf-i-comment-attachment');
                    console.log(values[field]);
                    values[field].push({
                        "content": content,
                        "attachment": attachment
                    });
                }
                else {
                    values[field] = this.getInputValue(this.getInputs()[i]);
                }
            }
            body["values"] = values;
            body["userid"] = this.userid;
            body["username"] = this.username;
            console.log(body);
            console.log(JSON.stringify(body));
            const authorization = btoa(Util.readCookie('email') + ":" + Util.readCookie('accessToken'));
            const xhr = (await this.prepareXhr(body, url, this._SfLoader, authorization));
            this._SfLoader.innerHTML = '';
            if (xhr.status == 200) {
                this.setSuccess('Operation Successful!');
                this.clearInputs();
                setTimeout(() => {
                    this.clearMessages();
                    this._SfButtonBack.click();
                }, 2000);
            }
            else {
                const jsonRespose = JSON.parse(xhr.responseText);
                this.setError(jsonRespose.error);
                setTimeout(() => {
                    this.clearMessages();
                }, 2000);
            }
        };
        this.submitEdit = async () => {
            this.clearMessages();
            console.log('submitEdit called');
            const body = {};
            let url = "";
            const values = this.populateValues();
            body["values"] = values;
            body["id"] = this.selectedId;
            body["userid"] = this.userid;
            body["username"] = this.username;
            url = "https://" + this.apiId + "/update";
            console.log(JSON.stringify(body), url);
            const authorization = btoa(Util.readCookie('email') + ":" + Util.readCookie('accessToken'));
            const xhr = (await this.prepareXhr(body, url, this._SfLoader, authorization));
            this._SfLoader.innerHTML = '';
            if (xhr.status == 200) {
                this.setSuccess('Operation Successful!');
                if (this.mode == "detail") {
                    setTimeout(() => {
                        this.clearInputs();
                        this.clearMessages();
                        this._SfButtonBack.click();
                    }, 2000);
                }
                else {
                    this.dispatchMyEvent("valueChanged", {});
                    this.dispatchMyEvent("valueUpdated", {});
                    this.loadMode();
                }
                setTimeout(() => {
                    this.clearMessages();
                }, 3000);
            }
            else {
                const jsonRespose = JSON.parse(xhr.responseText);
                this.setError(jsonRespose.error);
            }
        };
        this.populateValues = () => {
            var _a;
            const values = {};
            // for(var i = 0; i < this.getFields().length; i++) {
            //   const field = this.getFields()[i] as string;
            //   console.log('field', field);
            //   values[field] = this.getInputValue(this.getInputs()[i])
            // }
            for (var i = 0; i < this.getFields().length; i++) {
                const field = this.getFields()[i];
                if (field == "comments") {
                    if (values[field] == null) {
                        values[field] = (_a = this.selectedTicketDetails['comments']) !== null && _a !== void 0 ? _a : [];
                    }
                    let content = this.getInputValue('sf-i-comment-content');
                    content.value += this._sfSlottedForm[0].querySelector('#sf-i-changes').innerHTML;
                    let attachment = this.getInputValue('sf-i-comment-attachment');
                    console.log(values[field]);
                    values[field].push({
                        "content": content,
                        "attachment": attachment
                    });
                }
                else {
                    values[field] = this.getInputValue(this.getInputs()[i]);
                }
            }
            console.log('copied values', values);
            return values;
        };
        this.getValidationOfElement = (id) => {
            let ret = "";
            for (var i = 0; i < Object.keys(this.getValidations()).length; i++) {
                const key = Object.keys(this.getValidations())[i];
                console.log('key', key);
                if (key == id) {
                    return this.getValidations()[id];
                }
            }
            return ret;
        };
        this.evalSubmit = () => {
            var _a, _b;
            var evaluate = true;
            console.log('inputs', this.getInputs());
            for (var i = 0; i < this.getInputs().length; i++) {
                const id = this.getInputs()[i];
                const element = this._sfSlottedForm[0].querySelector('#' + id);
                if (element.style.display != "none") {
                    if (element.nodeName.toLowerCase() == "sf-i-select") {
                        const elementSfISelect = element;
                        const parentElement = elementSfISelect.parentElement;
                        const icon = parentElement.querySelector('.error-icon');
                        if (icon != null) {
                            parentElement.removeChild(icon);
                        }
                        if (element.hasAttribute('mandatory') && (elementSfISelect.selectedValues().length === 0 || elementSfISelect.selectedIndex() === 0)) {
                            const errorHtml = '<div class="error-icon d-flex justify-end color-error"><div class="material-symbols-outlined">exclamation</div></div>';
                            parentElement.insertAdjacentHTML('beforeend', errorHtml);
                            evaluate = false;
                            break;
                        }
                        else {
                            const errorHtml = '<div class="error-icon d-flex justify-end color-success"><div class="material-icons">done</div></div>';
                            parentElement.insertAdjacentHTML('beforeend', errorHtml);
                        }
                    }
                    else if (element.nodeName.toLowerCase() == "sf-i-sub-select") {
                        const elementSfISubSelect = element;
                        const parentElement = elementSfISubSelect.parentElement;
                        const icon = parentElement.querySelector('.error-icon');
                        if (icon != null) {
                            parentElement.removeChild(icon);
                        }
                        if (element.hasAttribute('mandatory') && (elementSfISubSelect.selectedValues().length === 0 || elementSfISubSelect.selectedIndex() === 0)) {
                            const errorHtml = '<div class="error-icon d-flex justify-end color-error"><div class="material-symbols-outlined">exclamation</div></div>';
                            parentElement.insertAdjacentHTML('beforeend', errorHtml);
                            evaluate = false;
                            break;
                        }
                        else if (elementSfISubSelect.style.display != "none") {
                            const errorHtml = '<div class="error-icon d-flex justify-end color-success"><div class="material-icons">done</div></div>';
                            parentElement.insertAdjacentHTML('beforeend', errorHtml);
                        }
                    }
                    else if (element.nodeName.toLowerCase() == "sf-i-form") {
                        const elementSfIForm = element;
                        const parentElement = elementSfIForm.parentElement;
                        const icon = parentElement.querySelector('.error-icon');
                        if (icon != null) {
                            parentElement.removeChild(icon);
                        }
                        if (elementSfIForm.mode == "list") {
                            console.log('form selected values', elementSfIForm.selectedValues());
                            console.log('form selected texts', elementSfIForm.selectedTexts());
                            if (element.hasAttribute('mandatory') && elementSfIForm.selectedValues().length === 0) {
                                const errorHtml = '<div class="error-icon d-flex justify-end color-error"><div class="material-symbols-outlined">exclamation</div></div>';
                                parentElement.insertAdjacentHTML('beforeend', errorHtml);
                                console.log('evaluate false return', element);
                                evaluate = false;
                                break;
                            }
                            else {
                                const errorHtml = '<div class="error-icon d-flex justify-end color-success"><div class="material-icons">done</div></div>';
                                parentElement.insertAdjacentHTML('beforeend', errorHtml);
                            }
                        }
                        else {
                            if (element.hasAttribute('mandatory') && elementSfIForm.selectedValues().length === 0) {
                                const errorHtml = '<div class="error-icon d-flex justify-end color-error"><div class="material-symbols-outlined">exclamation</div></div>';
                                parentElement.insertAdjacentHTML('beforeend', errorHtml);
                                console.log('evaluate false return', element, elementSfIForm.selectedValues());
                                evaluate = false;
                                break;
                            }
                            else {
                                const errorHtml = '<div class="error-icon d-flex justify-end color-success"><div class="material-icons">done</div></div>';
                                parentElement.insertAdjacentHTML('beforeend', errorHtml);
                            }
                        }
                    }
                    else if (element.nodeName.toLowerCase() == "sf-i-uploader") {
                        const elementSfIUploader = element;
                        const parentElement = elementSfIUploader.parentElement;
                        const icon = parentElement.querySelector('.error-icon');
                        if (icon != null) {
                            parentElement.removeChild(icon);
                        }
                        let errInValidation = true;
                        console.log('elementSfUploader uploadvalid', elementSfIUploader.uploadValid, elementSfIUploader.inputArr.length, element.hasAttribute('mandatory'));
                        if (element.hasAttribute('mandatory')) {
                            if (elementSfIUploader.uploadValid) {
                                errInValidation = false;
                            }
                            // errInValidation = !(elementSfIUploader.uploadValid || elementSfIUploader.inputArr.length == 0)
                        }
                        else {
                            if (elementSfIUploader.uploadValid) {
                                errInValidation = false;
                            }
                            else if (elementSfIUploader.inputArr.length === 0) {
                                errInValidation = false;
                            }
                            // errInValidation = !(elementSfIUploader.uploadValid)
                        }
                        if (errInValidation) {
                            const errorHtml = '<div class="error-icon d-flex justify-end color-error"><div class="material-symbols-outlined">exclamation</div></div>';
                            parentElement.insertAdjacentHTML('beforeend', errorHtml);
                            console.log('evaluate false return', element);
                            evaluate = false;
                            break;
                        }
                        else {
                            const errorHtml = '<div class="error-icon d-flex justify-end color-success"><div class="material-icons">done</div></div>';
                            parentElement.insertAdjacentHTML('beforeend', errorHtml);
                        }
                    }
                    else {
                        const parentElement = element.parentElement;
                        const icon = parentElement.querySelector('.error-icon');
                        if (icon != null) {
                            parentElement.removeChild(icon);
                        }
                        let errInValidation = false;
                        console.log('testingvalidate', element.value, (/\s{2}/.test(element.value)), this.getValidationOfElement(id));
                        if (!(/\s{2}/.test(element.value))) {
                            if (this.getValidationOfElement(id) == this.VALIDATION_TEXT_BASIC) {
                                let value = element.value;
                                if (element.value.length > 0 && !(/\s{2}/.test(element.value))) {
                                    if (value.indexOf('[') >= 0 || value.indexOf(']') >= 0) {
                                        errInValidation = true;
                                    }
                                    if (value.indexOf('"') >= 0) {
                                        errInValidation = true;
                                    }
                                    if (errInValidation) {
                                        evaluate = false;
                                        const errorHtml = '<div class="error-icon d-flex justify-end color-error"><div class="material-symbols-outlined">exclamation</div></div>';
                                        parentElement.insertAdjacentHTML('beforeend', errorHtml);
                                        console.log('evaluate false return', element);
                                        evaluate = false;
                                        return;
                                    }
                                }
                            }
                            if (this.getValidationOfElement(id) == this.VALIDATION_TEXT_DATE) {
                                let value = element.value;
                                if (element.value.length > 0) {
                                    if (value.indexOf(' ') >= 0) {
                                        errInValidation = true;
                                    }
                                    var regExpAlpha = /[a-zA-Z]/g;
                                    var regExpSpecial = /[ `!@#$%^&()_+\-=\[\]{};':"|.<>?~]/;
                                    if (regExpAlpha.test(value) || regExpSpecial.test(value)) {
                                        errInValidation = true;
                                    }
                                    if (errInValidation) {
                                        evaluate = false;
                                        const errorHtml = '<div class="error-icon d-flex justify-end color-error"><div class="material-symbols-outlined">exclamation</div></div>';
                                        parentElement.insertAdjacentHTML('beforeend', errorHtml);
                                        console.log('evaluate false return', element);
                                        evaluate = false;
                                        return;
                                    }
                                }
                            }
                            if (this.getValidationOfElement(id) == this.VALIDATION_SELECT) {
                                let value = element.value;
                                if (element.value.length > 0) {
                                    if (value.indexOf('noselect') >= 0) {
                                        errInValidation = true;
                                    }
                                    if (errInValidation) {
                                        evaluate = false;
                                        const errorHtml = '<div class="error-icon d-flex justify-end color-error"><div class="material-symbols-outlined">exclamation</div></div>';
                                        parentElement.insertAdjacentHTML('beforeend', errorHtml);
                                        console.log('evaluate false return', element);
                                        evaluate = false;
                                        return;
                                    }
                                }
                            }
                        }
                        else {
                            const errorHtml = '<div class="error-icon d-flex justify-end color-error"><div class="material-symbols-outlined">exclamation</div></div>';
                            parentElement.insertAdjacentHTML('beforeend', errorHtml);
                            errInValidation = true;
                            evaluate = false;
                        }
                        if (!errInValidation) {
                            if (element.id == "sf-i-comment-content") {
                                if ((element.value.length + this._sfSlottedForm[0].querySelector('#sf-i-changes').innerHTML.length) == 0) {
                                    const errorHtml = '<div class="error-icon d-flex justify-end color-error"><div class="material-icons">exclamation</div></div>';
                                    parentElement.insertAdjacentHTML('beforeend', errorHtml);
                                    console.log('evaluate false return', element, element.value);
                                    evaluate = false;
                                    break;
                                }
                                else {
                                    const errorHtml = '<div class="error-icon d-flex justify-end color-success"><div class="material-icons">check_circle</div></div>';
                                    parentElement.insertAdjacentHTML('beforeend', errorHtml);
                                }
                            }
                            else if (element.hasAttribute('mandatory') && element.value.length === 0) {
                                const errorHtml = '<div class="error-icon d-flex justify-end color-error"><div class="material-icons">exclamation</div></div>';
                                parentElement.insertAdjacentHTML('beforeend', errorHtml);
                                console.log('evaluate false return', element, element.value);
                                evaluate = false;
                                break;
                            }
                            else {
                                const errorHtml = '<div class="error-icon d-flex justify-end color-success"><div class="material-icons">check_circle</div></div>';
                                parentElement.insertAdjacentHTML('beforeend', errorHtml);
                            }
                        }
                        console.log('getvalidationofelement', id, this.getValidationOfElement(id));
                    }
                }
                else {
                    const parentElement = element.parentElement;
                    const icon = parentElement.querySelector('.error-icon');
                    if (icon != null) {
                        parentElement.removeChild(icon);
                    }
                }
            }
            console.log('evaluate', evaluate);
            if (evaluate) {
                (_a = this._sfButtonSubmit) === null || _a === void 0 ? void 0 : _a.removeAttribute('disabled');
            }
            else {
                (_b = this._sfButtonSubmit) === null || _b === void 0 ? void 0 : _b.setAttribute('disabled', true);
            }
        };
        this.disableConfirm = (value) => {
            if (!value) {
                //(this._sfButtonTrail as HTMLButtonElement).style.display = 'none';
                this._sfButtonCalendar.style.display = 'none';
                this._sfButtonCalendarCancel.style.display = 'none';
                this._SfButtonEditCancel.style.display = 'none';
                this._SfButtonEdit.style.display = 'none';
                this._sfButtonSubmit.style.display = 'none';
            }
            else {
                this.disableEdit(true);
            }
        };
        this.disableCalendar = (value) => {
            if (value) {
                this._sfButtonCalendar.style.display = 'block';
                this._sfButtonCalendarCancel.style.display = 'none';
                this._SfButtonEditCancel.style.display = 'none';
                this._SfButtonEdit.style.display = 'block';
                this._sfButtonSubmit.style.display = 'none';
                this._SfCalendarContainer.style.display = 'none';
                this._SfFormContainer.style.display = 'block';
            }
            else {
                this._sfButtonCalendar.style.display = 'none';
                this._sfButtonCalendarCancel.style.display = 'block';
                this._SfButtonEditCancel.style.display = 'none';
                this._SfButtonEdit.style.display = 'none';
                this._sfButtonSubmit.style.display = 'none';
                this._SfCalendarContainer.style.display = 'block';
                this._SfFormContainer.style.display = 'none';
            }
        };
        this.disableEdit = (value) => {
            console.log("disabling edits", value);
            if (value) {
                if (this.apiIdCalendarDetail != "") {
                    this._sfButtonCalendar.style.display = 'block';
                    this._sfButtonCalendarCancel.style.display = 'none';
                }
                this._SfButtonEditCancel.style.display = 'none';
                this._SfButtonEdit.style.display = 'block';
                this._sfSlottedForm[0].querySelector("#new-comment-container").style.display = 'none';
                this._sfButtonSubmit.style.display = 'none';
            }
            else {
                // (this._sfButtonTrail as HTMLButtonElement).style.display = 'none';
                if (this.apiIdCalendarDetail != "") {
                    this._sfButtonCalendar.style.display = 'none';
                    this._sfButtonCalendarCancel.style.display = 'none';
                }
                this._SfButtonEditCancel.style.display = 'block';
                this._SfButtonEdit.style.display = 'none';
                this._sfButtonSubmit.style.display = 'block';
                this._sfSlottedForm[0].querySelector("#new-comment-container").style.display = 'block';
                console.log('ticketing mode', this.mode, this.isAdmin());
                if (this.mode != "new" || !this.isAdmin()) {
                    this._sfSlottedForm[0].querySelector("#sf-i-project").flow = 'read';
                    this._sfSlottedForm[0].querySelector("#sf-i-initiator").flow = 'read';
                }
                else {
                    this._sfSlottedForm[0].querySelector("#sf-i-project").flow = '';
                    this._sfSlottedForm[0].querySelector("#sf-i-initiator").flow = '';
                }
                if (!this.isAdmin()) {
                    this._sfSlottedForm[0].querySelector("#sf-i-assignedto").flow = 'read';
                    // (this._sfSlottedForm[0].querySelector("#sf-i-assignedto") as SfIForm).loadMode();
                }
                // (this._sfSlottedForm[0].querySelector("#sf-i-project") as SfIForm).loadMode();
                // (this._sfSlottedForm[0].querySelector("#sf-i-initiator") as SfIForm).loadMode();
            }
            this.processFiltersByEvent();
        };
        this.hideDelete = () => {
            this._SfButtonDelete.style.display = 'none';
        };
        this.hideBack = () => {
            this._SfButtonBack.style.visibility = 'hidden';
        };
        this.formatShortlistedSearchPhrase = () => {
            var searchStr = "";
            for (var i = 0; i < Object.keys(this.shortlistedSearchPhrases).length; i++) {
                searchStr += (this.shortlistedSearchPhrases[Object.keys(this.shortlistedSearchPhrases)[i]]);
                if (i < (Object.keys(this.shortlistedSearchPhrases).length - 1)) {
                    searchStr += '&';
                }
            }
            this.searchPhrase = searchStr;
        };
        this.updateShortlistedSearchPhrase = (parents, childElement) => {
            for (var k = 0; k < parents.length; k++) {
                const parentElement = this._sfSlottedForm[0].querySelector('#' + parents[k]);
                if (parentElement.nodeName.toLowerCase() == "sf-i-select") {
                    var selText = '';
                    for (var l = 0; l < parentElement.selectedTexts().length; l++) {
                        selText += parentElement.selectedTexts()[l];
                        if (l < (parentElement.selectedTexts().length - 1)) {
                            selText += '&';
                        }
                    }
                    childElement.shortlistedSearchPhrases[parentElement.id] = selText;
                }
                else if (parentElement.nodeName.toLowerCase() == "sf-i-sub-select") {
                    var selText = '';
                    for (var l = 0; l < parentElement.selectedTexts().length; l++) {
                        selText += parentElement.selectedTexts()[l];
                        if (l < (parentElement.selectedTexts().length - 1)) {
                            selText += '&';
                        }
                    }
                    childElement.shortlistedSearchPhrases[parentElement.id] = selText;
                }
                else if (parentElement.nodeName.toLowerCase() == "sf-i-form") {
                    var selText = '';
                    for (var l = 0; l < parentElement.selectedTexts().length; l++) {
                        selText += parentElement.selectedTexts()[l];
                        if (l < (parentElement.selectedTexts().length - 1)) {
                            selText += '&';
                        }
                    }
                    childElement.shortlistedSearchPhrases[parentElement.id] = selText;
                }
                else if (parentElement.nodeName.toLowerCase() == "input" || parentElement.nodeName.toLowerCase() == "textarea") {
                    var selText = '';
                    selText += parentElement.value + "&";
                    childElement.shortlistedSearchPhrases[parentElement.id] = selText;
                }
            }
            childElement.formatShortlistedSearchPhrase();
            console.log('SFIFORM_load_Mode', 10);
            childElement.loadMode();
        };
        this.processDependencies = () => {
            for (var i = 0; i < this.getDependencies().length; i++) {
                const type = this.getDependencies()[i].type;
                if (type == "searchable") {
                    const parents = this.getDependencies()[i].parents;
                    const child = this.getDependencies()[i].child;
                    const childElement = this._sfSlottedForm[0].querySelector('#' + child);
                    for (var j = 0; j < parents.length; j++) {
                        const parent = parents[j];
                        const parentElement = this._sfSlottedForm[0].querySelector('#' + parent);
                        if (parentElement.nodeName.toLowerCase() == "sf-i-form" || parentElement.nodeName.toLowerCase() == "sf-i-select" || parentElement.nodeName.toLowerCase() == "sf-i-sub-select") {
                            parentElement === null || parentElement === void 0 ? void 0 : parentElement.addEventListener('valueChanged', () => {
                                console.log('value changed', parentElement.nodeName.toLowerCase(), parentElement.value);
                                this.updateShortlistedSearchPhrase(parents, childElement);
                            });
                            parentElement === null || parentElement === void 0 ? void 0 : parentElement.addEventListener('renderComplete', () => {
                                this.updateShortlistedSearchPhrase(parents, childElement);
                            });
                        }
                        else if (parentElement.nodeName.toLowerCase() == "sf-i-uploader") {
                            parentElement === null || parentElement === void 0 ? void 0 : parentElement.addEventListener('uploadValid', () => {
                                this.updateShortlistedSearchPhrase(parents, childElement);
                            });
                            // parentElement?.addEventListener('uploadComplete', () => {
                            //   console.log('value changed', parentElement.nodeName.toLowerCase(), (parentElement as HTMLInputElement).value)
                            //   this.updateShortlistedSearchPhrase(parents, childElement);
                            // });
                            // parentElement?.addEventListener('analysisCompleted', () => {
                            //   console.log('value changed', parentElement.nodeName.toLowerCase(), (parentElement as HTMLInputElement).value)
                            //   this.updateShortlistedSearchPhrase(parents, childElement);
                            // });
                        }
                        else {
                            parentElement === null || parentElement === void 0 ? void 0 : parentElement.addEventListener('keyup', () => {
                                console.log('keyup fired...');
                                this.updateShortlistedSearchPhrase(parents, childElement);
                            });
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
                }
                else {
                    const parent = this.getDependencies()[i].parent;
                    const child = this.getDependencies()[i].child;
                    const parentElement = this._sfSlottedForm[0].querySelector('#' + parent);
                    const childElement = this._sfSlottedForm[0].querySelector('#' + child);
                    parentElement === null || parentElement === void 0 ? void 0 : parentElement.addEventListener('valueChanged', (ev) => {
                        childElement.filterId = ev.detail.newValue;
                        childElement.populateList();
                    });
                    childElement.filterId = parentElement.selectedValues()[0];
                    childElement.populateList();
                }
            }
        };
        this.initShowInputs = async () => {
            for (var i = 0; i < this.getInputs().length; i++) {
                console.log("input ids", this.getInputs()[i]);
                const element = this._sfSlottedForm[0].querySelector('#' + this.getInputs()[i]);
                const elementLabel = this._sfSlottedForm[0].querySelector('#' + this.getInputs()[i] + '-label');
                if (this.getInputs()[i] == "sf-i-status") {
                    if (this.mode == "new") {
                        element.style.display = 'none';
                        this._sfSlottedForm[0].querySelector('#sf-i-status-container').style.display = 'none';
                    }
                    else {
                        element.style.display = 'block';
                        this._sfSlottedForm[0].querySelector('#sf-i-status-container').style.display = 'block';
                    }
                }
                else if (this.getInputs()[i] == "sf-i-assignedto") {
                    if (!this.isAdmin() && this.mode == "new") {
                        element.style.display = 'none';
                        this._sfSlottedForm[0].querySelector('#sf-i-assignedto-container').style.display = 'none';
                    }
                    else {
                        element.style.display = 'block';
                        element.searchPhrase = this.adminProfileShortcode;
                        console.log('SFIFORM_load_Mode', 1);
                        element.loadMode();
                        this._sfSlottedForm[0].querySelector('#sf-i-assignedto-container').style.display = 'block';
                    }
                }
                else if (this.getInputs()[i] == "sf-i-comments") {
                    if (this.mode == "new") {
                        element.style.display = 'none';
                        elementLabel.style.display = 'none';
                        this._sfSlottedForm[0].querySelector('#sf-i-comments-container').style.display = 'none';
                    }
                    else {
                        element.style.display = 'flex';
                        elementLabel.style.display = 'inline';
                        this._sfSlottedForm[0].querySelector('#sf-i-comments-container').style.display = 'flex';
                    }
                }
                else {
                    element.style.display = 'flex';
                }
                // element.style.display = 'block';
            }
            await this.fetchMasters(this.renderMasters);
        };
        this.initDisableInputs = (value, reload = true) => {
            for (var i = 0; i < this.getInputs().length; i++) {
                const element = this._sfSlottedForm[0].querySelector('#' + this.getInputs()[i]);
                console.log('disabling', element, value);
                if (element.nodeName.toLowerCase() == "sf-i-select") {
                    element.flow = value ? "read" : "";
                    console.log('disabling1', element);
                    element.initState();
                }
                else if (element.nodeName.toLowerCase() == "sf-i-sub-select") {
                    element.flow = value ? "read" : "";
                    element.initState();
                }
                else if (element.nodeName.toLowerCase() == "sf-i-form") {
                    console.log('init disabling form', element.mode);
                    let oldFlow = element.flow;
                    element.flow = (value || ((this.getInputs()[i] == "sf-i-project" || this.getInputs()[i] == "sf-i-initiator") && (this.mode != "new" || !this.isAdmin())) || (this.getInputs()[i] == "sf-i-assignedto" && !this.isAdmin())) ? "read" : "";
                    if (this.getInputs()[i] == "sf-i-assignedto" && this.isAdmin() && element.flow != "read") {
                        element.enableEditButton = "yes";
                    }
                    else {
                        element.enableEditButton = "no";
                    }
                    if (oldFlow != element.flow) {
                        if (reload) {
                            console.log('SFIFORM_load_Mode', 2);
                            element.loadMode();
                        }
                    }
                    console.log('ticketing mode', (value || ((this.getInputs()[i] == "sf-i-project" || this.getInputs()[i] == "sf-i-initiator") && (this.mode != "new" || !this.isAdmin())) || (this.getInputs()[i] == "sf-i-assignedto" && !this.isAdmin())), element.flow, element);
                    //(element as SfITicketing).initState();
                }
                else if (element.nodeName.toLowerCase() == "sf-i-uploader") {
                    element.readOnly = value;
                    element.loadMode();
                    console.log('init disabling form', element.readOnly, value, element.prepopulatedInputArr, element.current, element.mode);
                }
                else if (this.getInputs()[i] == "sf-i-comments") {
                    this._sfSlottedForm[0].querySelector("#new-comment-container").style.display = value ? 'none' : 'block';
                }
                else {
                    if (value || ((this.getInputs()[i] == "sf-i-status" && !this.isAdmin()))) {
                        element.setAttribute('disabled', 'disabled');
                    }
                    else {
                        element.removeAttribute('disabled');
                    }
                }
            }
        };
        this.clearInputs = () => {
            for (var i = 0; i < this.getInputs().length; i++) {
                const element = this._sfSlottedForm[0].querySelector('#' + this.getInputs()[i]);
                console.log('clearing inputs', element);
                if (element.nodeName.toLowerCase() == "sf-i-select") {
                    element.selectedId = [];
                    element.clearSelection();
                    // if((element as SfISelect).selectedId == null || (element as SfISelect).selectedId == "") {
                    //   (element as SfISelect).clearSelection();
                    // }
                }
                else if (element.nodeName.toLowerCase() == "sf-i-sub-select") {
                    element.selectedId = [];
                    element.clearSelection();
                    // if((element as SfISubSelect).selectedId == null || (element as SfISubSelect).selectedId == "") {
                    //   (element as SfISubSelect).clearSelection();
                    // }
                }
                else if (element.nodeName.toLowerCase() == "sf-i-form") {
                    element.selectedSearchId = [];
                    element.clearSelection();
                    if (element.id == "sf-i-assignedto") {
                        element.searchPhrase = this.adminProfileShortcode;
                    }
                    else {
                        element.searchPhrase = "";
                    }
                    console.log('SFIFORM_load_Mode', 3);
                    element.loadMode();
                    // if((element as SfITicketing).selectedSearchId == null || (element as SfITicketing).selectedSearchId == "") {
                    //   (element as SfITicketing).clearSelection();
                    // }
                }
                else if (element.nodeName.toLowerCase() == "sf-i-uploader") {
                    console.log('clearing inputs');
                    element.prepopulatedInputArr = "[]";
                    element.clearUploads();
                    element.loadMode();
                    console.log('clearing inputs');
                    // if((element as SfITicketing).selectedSearchId == null || (element as SfITicketing).selectedSearchId == "") {
                    //   (element as SfITicketing).clearSelection();
                    // }
                }
                else if (element.nodeName.toLowerCase() == "select") {
                    console.log('clearing inputs');
                    element.value = "noselect";
                }
                else {
                    element.value = "";
                }
                if (this.getInputs()[i] == "sf-i-comments") {
                    this._sfSlottedForm[0].querySelector('#sf-i-comment-content').value = "";
                    this._sfSlottedForm[0].querySelector('#sf-i-changes').innerHTML = "";
                    let attachementUploader = this._sfSlottedForm[0].querySelector('#sf-i-comment-attachment');
                    attachementUploader.prepopulatedInputArr = "[]";
                    attachementUploader.clearUploads();
                    attachementUploader.loadMode();
                }
            }
        };
        this.removeItemByValue = (value) => {
            if (!this.removedValues.includes(value))
                this.removedValues.push(value);
        };
        this.processFormLayouting = () => {
            for (var i = 0; i < this.getInputs().length; i++) {
                const element = this._sfSlottedForm[0].querySelector('#' + this.getInputs()[i]);
                if (element.nodeName.toLowerCase() == "sf-i-select") {
                }
                else if (element.nodeName.toLowerCase() == "sf-i-sub-select") {
                }
                else {
                    //(element as HTMLInputElement).style.width = '98%';
                }
            }
            this._sfButtonSubmit.style.width = '100%';
        };
        this.fWait = (ms) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log("Done waiting");
                    resolve(ms);
                }, ms);
            });
        };
        this.checkButtonState = true;
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
        this.checkButtonStates = () => {
            var _a, _b, _c, _d;
            this.checkButtonState = false;
            var checkCount = 0;
            var checkTotal = 0;
            if (this._SfFormC[0] == null) {
                this.checkButtonState = true;
                console.log('i = func checkbuttonstate returning null', this.checkButtonState);
                return;
            }
            console.log('i = func checkbuttonstate no null 10', this.checkButtonState);
            const selects = this._SfFormC[0].querySelectorAll('sf-i-select');
            for (var i = 0; i < selects.length; i++) {
                checkTotal++;
                const outerHtml = (_a = selects[i].nextElementSibling) === null || _a === void 0 ? void 0 : _a.outerHTML;
                if (selects[i].hasAttribute('mandatory')) {
                    if (outerHtml != null) {
                        if (outerHtml.indexOf('color-success') >= 0) {
                            checkCount++;
                        }
                    }
                }
            }
            console.log('i = func checkbuttonstate no null 11', this.checkButtonState);
            if (!this.checkButtonState) {
                const subSelects = this._SfFormC[0].querySelectorAll('sf-i-sub-select');
                for (var i = 0; i < subSelects.length; i++) {
                    checkTotal++;
                    const outerHtml = (_b = subSelects[i].nextElementSibling) === null || _b === void 0 ? void 0 : _b.outerHTML;
                    console.log('checkbuttonstate', subSelects[i], subSelects[i].hasAttribute('mandatory'));
                    if (subSelects[i].hasAttribute('mandatory')) {
                        if (outerHtml != null) {
                            if (outerHtml.indexOf('color-success') >= 0) {
                                checkCount++;
                            }
                        }
                    }
                }
            }
            console.log('i = func checkbuttonstate no null 12', this.checkButtonState);
            if (!this.checkButtonState) {
                const subForms = this._SfFormC[0].querySelectorAll('sf-i-form');
                for (var i = 0; i < subForms.length; i++) {
                    checkTotal++;
                    const outerHtml = (_c = subForms[i].nextElementSibling) === null || _c === void 0 ? void 0 : _c.outerHTML;
                    if (subForms[i].hasAttribute('mandatory')) {
                        if (outerHtml != null) {
                            if (outerHtml.indexOf('color-success') >= 0) {
                                checkCount++;
                            }
                        }
                    }
                }
            }
            console.log('i = func checkbuttonstate no null 13', this.checkButtonState);
            if (!this.checkButtonState) {
                const subInputs = this._SfFormC[0].querySelectorAll('input');
                for (var i = 0; i < subInputs.length; i++) {
                    checkTotal++;
                    const outerHtml = (_d = subInputs[i].nextElementSibling) === null || _d === void 0 ? void 0 : _d.outerHTML;
                    if (subInputs[i].hasAttribute('mandatory')) {
                        if (outerHtml != null) {
                            if (outerHtml.indexOf('color-success') >= 0) {
                                checkCount++;
                            }
                        }
                    }
                }
            }
            if (checkCount < checkTotal / 2)
                this.checkButtonState = true;
            console.log('i = func checkbuttonstate no null 2', this.checkButtonState);
        };
        this.loopThroughSearchResults = async () => {
            this.setNotif('Refresh in progress...');
            // Indicates the page that has been processed
            var count = 0;
            while (true) {
                // Get the next button
                var buttonNext = this._SfSearchListContainer.querySelector('#button-next-cursor');
                if (buttonNext != null && count > 0) {
                    // If next button exists and if the flow is on the subsequent pages
                    for (var k = 0; k < count; k++) {
                        buttonNext.click();
                        await this.fWait(3000);
                        buttonNext = this._SfSearchListContainer.querySelector('#button-next-cursor');
                    }
                }
                // At this point, we have arrived on the right page
                // Get the list of view buttons
                var buttons = this._SfSearchListContainer.querySelectorAll('.button-search-view');
                for (var i = 0; i < buttons.length; i++) {
                    // Click the next view button and go to the detail page
                    buttons[i].click();
                    await this.fWait(2000);
                    this.setNotif('Refresh in progress... ' + parseInt(((i * 100) / buttons.length) + "%"));
                    await this.fWait(3000);
                    // Click the edit button
                    this._SfButtonEdit.click();
                    await this.fWait(2000);
                    // Validate all fields
                    this.evalSubmit();
                    await this.fWait(2000);
                    // Submit, after success it goes back to the search screen
                    this._sfButtonSubmit.click();
                    await this.fWait(5000);
                    // Fetch the search list
                    // await this.fetchSearch();
                }
                buttonNext = this._SfSearchListContainer.querySelector('#button-next-cursor');
                if (buttonNext == null) {
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
        };
        this.initSearchView = () => {
            if (this.isAdmin()) {
                this._SfSearchFiltersContainer.classList.remove('hide-important');
                this._SfSearchBadge.classList.remove('hide-important');
                this.initSearchListeners();
                this.fetchMasters(this.renderMastersSearch);
            }
            else {
                this._SfSearchFiltersContainer.classList.add('hide-important');
                this._SfSearchBadge.classList.add('hide-important');
            }
        };
        this.initSearchListeners = () => {
            for (let searchFilterId of this.searchFilterIds) {
                let element = this._SfSearchFiltersContainer.querySelector('#' + searchFilterId);
                if (element.tagName.toLowerCase() == "sf-i-form") {
                    element.addEventListener('valueChanged', () => {
                        let event = new Event('click');
                        this._sfButtonAll.dispatchEvent(event);
                    });
                }
                else if (element.tagName.toLowerCase() == "select") {
                    element.addEventListener('change', () => {
                        let event = new Event('click');
                        this._sfButtonAll.dispatchEvent(event);
                    });
                }
            }
        };
        this.populateSearchFilterValues = () => {
            console.log('search params', this.searchParams);
            let filtersPresentFlag = false;
            for (let searchFilterId of this.searchFilterIds) {
                if (this.searchParams.filters != null && this.searchParams.filters[searchFilterId] != null) {
                    console.log('search field', searchFilterId, this.searchParams.filters[searchFilterId]);
                    if (this.searchParams.filters[searchFilterId].value.length > 0 && this.searchParams.filters[searchFilterId].value != 'noselect') {
                        filtersPresentFlag = true;
                    }
                    let element = this._SfSearchFiltersContainer.querySelector('#' + searchFilterId);
                    if (element.tagName.toLowerCase() == "sf-i-form") {
                        console.log('search field setting value', element, this.searchParams.filters[searchFilterId].value);
                        element.preselectedValues = JSON.stringify(this.searchParams.filters[searchFilterId].value);
                        console.log('SFIFORM_load_Mode', 4);
                        element.loadMode();
                        console.log('search field element', element.selectedId);
                    }
                    else if (element.tagName.toLowerCase() == "select") {
                        element.value = this.searchParams.filters[searchFilterId].value;
                    }
                }
            }
            setTimeout(() => {
                if (filtersPresentFlag) {
                    let event = new Event('click');
                    this._sfButtonAll.dispatchEvent(event);
                }
            }, 2000);
        };
        this.initDecryptView = () => {
            if (this.isAdmin()) {
                let divsArr = this._SfDecryptContainer.querySelectorAll("#decrypt-container > div");
                console.log('decrypt divs', divsArr);
                for (let divElement of divsArr) {
                    divElement.classList.remove('hide');
                }
                this.initDecryptListeners();
            }
            else {
                let divsArr = this._SfDecryptContainer.querySelectorAll("#decrypt-container > div");
                console.log('decrypt divs', divsArr);
                for (let divElement of divsArr) {
                    divElement.classList.add('hide');
                }
            }
        };
        this.initDecryptListeners = () => {
            this._SfDecryptProjectInput.addEventListener('valueChanged', () => {
                let projectId = this._SfDecryptProjectInput.selectedValues()[0];
                this.decryptProjectId = projectId.split(';')[projectId.split(';').length - 1];
                this.evalDecrypt();
            });
            this._SfDecryptFileInput.addEventListener('keyup', () => {
                console.log('keyup called');
                this.decryptFileName = this._SfDecryptFileInput.value;
                this.evalDecrypt();
            });
            this._SfDecryptButton.addEventListener('click', () => {
                console.log('decrypt clicked', this.decryptProjectId, this.decryptFileName);
                this.submitDecrypt();
            });
        };
        this.evalDecrypt = () => {
            var _a, _b;
            console.log(this._SfDecryptFileInput);
            console.log('evalDecrypt', this.decryptProjectId, this.decryptFileName);
            if (this.decryptProjectId != null && this.decryptProjectId != "" && this.decryptFileName != null && this.decryptFileName.length > 3) {
                ((_a = this._SfDecryptContainer) === null || _a === void 0 ? void 0 : _a.querySelector('#button-decrypt')).removeAttribute('disabled');
            }
            else {
                ((_b = this._SfDecryptContainer) === null || _b === void 0 ? void 0 : _b.querySelector('#button-decrypt')).setAttribute('disabled', 'true');
            }
        };
        this.submitDecrypt = async () => {
            this.clearMessages();
            console.log('submitDecrypt called');
            const body = {};
            let url = "https://" + this.apiId + "/getdecryptedjson";
            body["projectid"] = this.decryptProjectId;
            body["key"] = this.decryptFileName + ".json";
            console.log(body);
            console.log(JSON.stringify(body));
            const authorization = btoa(Util.readCookie('email') + ":" + Util.readCookie('accessToken'));
            const xhr = (await this.prepareXhr(body, url, this._SfLoader, authorization));
            this._SfLoader.innerHTML = '';
            if (xhr.status == 200) {
                const jsonRespose = JSON.parse(xhr.responseText);
                console.log('decrypt response', jsonRespose);
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
            }
            else {
                const jsonRespose = JSON.parse(xhr.responseText);
                this.setError(jsonRespose.error);
                setTimeout(() => {
                    this.clearMessages();
                }, 5000);
            }
        };
        this.initListenersView = () => {
            var _a;
            console.log('init listeners view');
            // this._sfInputSearch?.addEventListener('keyup', () => {
            //   console.log('keyup called');
            //   this.searchPhrase = this._sfInputSearch.value;
            //   if(this._sfInputSearch.value.length > 2) {
            //     this.fetchSearch();
            //   }
            // });
            (_a = this._SfButtonNew) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
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
                this._SfInputEndDate.setAttribute('min', new Date(this._SfSearchStartDate.value).toISOString().slice(0, 10));
                // this.fetchLogs()
            });
            this._SfSearchEndDate.addEventListener('change', () => {
                this._SfSearchStartDate.setAttribute('max', new Date(this._SfSearchEndDate.value).toISOString().slice(0, 10));
                // this.fetchLogs()
            });
        };
        this.initListenersTrail = async () => {
            this._SfButtonBack.addEventListener('click', () => {
                this.mode = "view";
                this.loadMode();
            });
            console.log(this._SfButtonFetchLog);
            this._SfButtonFetchLog.addEventListener('click', () => {
                console.log("fetch logs clicked", this._SfInputStartDate.value, this._SfInputEndDate.value);
                this.fetchLogs();
            });
            this._SfInputStartDate.addEventListener('change', () => {
                this._SfInputEndDate.setAttribute('min', new Date(this._SfInputStartDate.value).toISOString().slice(0, 10));
                this.fetchLogs();
            });
            this._SfInputEndDate.addEventListener('change', () => {
                this._SfInputStartDate.setAttribute('max', new Date(this._SfInputEndDate.value).toISOString().slice(0, 10));
                this.fetchLogs();
            });
        };
        this.clearUnitFilters = () => {
            for (var i = 0; i < this.getInputs().length; i++) {
                const element = this._sfSlottedForm[0].querySelector('#' + this.getInputs()[i]);
                if (element.nodeName.toLowerCase() == "sf-i-select") {
                    element.removedValues = [];
                }
                else if (element.nodeName.toLowerCase() == "sf-i-sub-select") {
                    element.removedValues = [];
                }
                else if (element.nodeName.toLowerCase() == "sf-i-form") {
                    element.removedValues = [];
                }
            }
        };
        this.processFiltersByEvent = () => {
            var filters = null;
            if (this.mode == "new") {
                filters = this.getUnitFiltersNew();
            }
            if (this.mode == "detail" || this.mode == "consumer") {
                filters = this.getUnitFiltersDetail();
            }
            for (var i = 0; i < filters.length; i++) {
                if (filters[i].op == "hide") {
                    const inputElement = this._SfFormC[0].querySelector('#' + filters[i].input);
                    const value = filters[i].value;
                    //
                    if (filters[i].input != null) {
                        if (inputElement.nodeName.toLowerCase() == "sf-i-select") {
                            if (Array.isArray(value)) {
                                var foundFlag = false;
                                for (var j = 0; j < value.length; j++) {
                                    if (inputElement.selectedValues()[0] == value[j]) {
                                        foundFlag = true;
                                    }
                                }
                                if (foundFlag) {
                                    if (Array.isArray(filters[i].target)) {
                                        for (var k = 0; k < filters[i].target.length; k++) {
                                            const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target[k]);
                                            targetElement.style.display = 'none';
                                        }
                                    }
                                    else {
                                        const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target);
                                        targetElement.style.display = 'none';
                                    }
                                }
                                else {
                                    if (Array.isArray(filters[i].target)) {
                                        for (var k = 0; k < filters[i].target.length; k++) {
                                            const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target[k]);
                                            targetElement.style.display = 'inline';
                                        }
                                    }
                                    else {
                                        const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target);
                                        targetElement.style.display = 'inline';
                                    }
                                }
                            }
                            else {
                                if (inputElement.selectedValues()[0] == value) {
                                    if (Array.isArray(filters[i].target)) {
                                        for (var k = 0; k < filters[i].target.length; k++) {
                                            const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target[k]);
                                            targetElement.style.display = 'none';
                                        }
                                    }
                                    else {
                                        const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target);
                                        targetElement.style.display = 'none';
                                    }
                                }
                                else {
                                    if (Array.isArray(filters[i].target)) {
                                        for (var k = 0; k < filters[i].target.length; k++) {
                                            const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target[k]);
                                            targetElement.style.display = 'inline';
                                        }
                                    }
                                    else {
                                        const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target);
                                        targetElement.style.display = 'inline';
                                    }
                                }
                            }
                        }
                        else if (inputElement.nodeName.toLowerCase() == "sf-i-sub-select") {
                            if (inputElement.selectedValues()[0] == value) {
                                if (Array.isArray(filters[i].target)) {
                                    for (var k = 0; k < filters[i].target.length; k++) {
                                        const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target[k]);
                                        targetElement.style.display = 'none';
                                    }
                                }
                                else {
                                    const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target);
                                    targetElement.style.display = 'none';
                                }
                            }
                            else {
                                if (Array.isArray(filters[i].target)) {
                                    for (var k = 0; k < filters[i].target.length; k++) {
                                        const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target[k]);
                                        targetElement.style.display = 'inline';
                                    }
                                }
                                else {
                                    const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target);
                                    targetElement.style.display = 'inline';
                                }
                            }
                        }
                        else if (inputElement.nodeName.toLowerCase() == "sf-i-form") {
                            if (inputElement.selectedValues()[0] == value) {
                                if (Array.isArray(filters[i].target)) {
                                    for (var k = 0; k < filters[i].target.length; k++) {
                                        const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target[k]);
                                        targetElement.style.display = 'none';
                                    }
                                }
                                else {
                                    const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target);
                                    targetElement.style.display = 'none';
                                }
                            }
                            else {
                                if (Array.isArray(filters[i].target)) {
                                    for (var k = 0; k < filters[i].target.length; k++) {
                                        const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target[k]);
                                        targetElement.style.display = 'inline';
                                    }
                                }
                                else {
                                    const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target);
                                    targetElement.style.display = 'inline';
                                }
                            }
                        }
                        else {
                            if (inputElement.value == value) {
                                if (Array.isArray(filters[i].target)) {
                                    for (var k = 0; k < filters[i].target.length; k++) {
                                        const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target[k]);
                                        targetElement.style.display = 'none';
                                    }
                                }
                                else {
                                    const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target);
                                    targetElement.style.display = 'none';
                                }
                            }
                            else {
                                if (Array.isArray(filters[i].target)) {
                                    for (var k = 0; k < filters[i].target.length; k++) {
                                        const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target[k]);
                                        targetElement.style.display = 'inline';
                                    }
                                }
                                else {
                                    const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target);
                                    targetElement.style.display = 'inline';
                                }
                            }
                        }
                    }
                    else {
                        if (Array.isArray(filters[i].target)) {
                            for (var k = 0; k < filters[i].target.length; k++) {
                                const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target[k]);
                                targetElement.style.display = 'none';
                            }
                        }
                        else {
                            const targetElement = this._SfFormC[0].querySelector('#' + filters[i].target);
                            targetElement.style.display = 'none';
                        }
                    }
                    console.log('processing filters element', inputElement);
                }
            }
        };
        this.completeSelect = () => {
            var found = false;
            let valToAdd = this._SfSearchMultiselectSelect.value;
            console.log('valToAdd', valToAdd);
            if (valToAdd != "noselect" && valToAdd != "") {
                for (let selectedVal of this.multiselectArr) {
                    if (selectedVal == valToAdd) {
                        found = true;
                    }
                }
            }
            if (!found && valToAdd != "noselect" && valToAdd != "") {
                this.multiselectArr.push(valToAdd);
            }
            // var divArr = (this._SfSearchMultiselectSelected as HTMLDivElement).querySelectorAll('div');
            // for(var i = 0; i < divArr.length; i++) {
            //   console.log(divArr[i], divArr[i].innerHTML)
            //   if(divArr[i].innerHTML == (this._SfSearchMultiselectSelect as HTMLSelectElement)!.value) {
            //     found = true;
            //   }
            // }
            let html = '';
            for (var i = 0; i < this.multiselectArr.length; i++) {
                html += `<div part="badge-multiselected" class="badge-multiselected d-flex align-center"><div part="button-icon-small-cancel" class="d-flex material-icons color-gray pointer button-icon-small-cancel" id="search-multiselect-delete-${i}">cancel</div>` + this.multiselectArr[i] + `</div>`;
            }
            this._SfSearchMultiselectSelected.innerHTML = html;
            this._SfSearchMultiselectInput.value = '';
            if (this.multiselectArr.length > 0) {
                this._SfSearchMultiselectInput.focus();
            }
            this._SfSearchMultiselectSelect.selectedIndex = 0;
            this._SfSearchMultiselectSelect.style.display = 'none';
            if (this.multiselectArr.length > 0) {
                this._SfSearchMultiselectDelete.style.display = 'flex';
            }
            else {
                this._SfSearchMultiselectDelete.style.display = 'none';
            }
            for (i = 0; i < this.multiselectArr.length; i++) {
                let index = i;
                this._SfSearchMultiselectSelected.querySelector('#search-multiselect-delete-' + i).addEventListener('click', () => {
                    console.log("deleting 1", this.multiselectArr[index], index);
                    this.removeFromMultiselect(index);
                });
            }
            if (!found) {
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
        };
        this.removeFromMultiselect = (index) => {
            console.log('unchanged arr', this.multiselectArr);
            if (index == 0 && this.multiselectArr.length == 1) {
                this.multiselectArr = [];
            }
            else {
                this.multiselectArr.splice(index, 1);
            }
            console.log('changed arr', this.multiselectArr);
            this.completeSelect();
            // var html = `<div part="badge-multiselected" class="badge-multiselected">`+val+`<div part="button-icon-small" class="d-flex hide material-icons color-gray pointer" id="search-multiselect-delete-${count}" style="display: flex;">delete</div></div>`;
            // let innerHtml = (this._SfSearchMultiselectSelected as HTMLDivElement).innerHTML
            // console.log('html', html)
            // console.log('innerhtml', innerHtml)
            // innerHtml = innerHtml.replace(html,'');
            // (this._SfSearchMultiselectSelected as HTMLDivElement).innerHTML = innerHtml
            this.dispatchMyEvent("valueChanged", {});
        };
        this.initListenersMultiselect = () => {
            this._SfSearchMultiselectInput.addEventListener('keyup', () => {
                this._SfSearchMultiselectSelect.style.display = 'block';
                this.fetchSearchMultiselect();
            });
            this._SfSearchMultiselectSelect.addEventListener('change', () => {
                console.log('change');
                const value = this._SfSearchMultiselectSelect.value;
                if (value != "" && value != "noselect") {
                    this.completeSelect();
                }
            });
            this._SfSearchMultiselectDelete.addEventListener('click', () => {
                this._SfSearchMultiselectSelected.innerHTML = '';
                this._SfSearchMultiselectDelete.style.display = 'none';
                this.dispatchMyEvent("valueChanged", {});
            });
        };
        this.initPrepopulateNew = () => {
            if (!this.isAdmin()) {
                let elementProject = this._sfSlottedForm[0].querySelector('#sf-i-project');
                elementProject.flow = "read";
                elementProject.selectedSearchId = [Util.readCookie('projectId')];
                console.log('prepopulate input project', elementProject.selectedSearchId);
                elementProject.loadMode();
                let elementInitiator = this._sfSlottedForm[0].querySelector('#sf-i-initiator');
                elementInitiator.flow = "read";
                elementInitiator.selectedSearchId = [this.userid];
                elementInitiator.loadMode();
                console.log('prepopulate input initiator', elementInitiator.selectedSearchId);
            }
        };
        this.initListenersNew = () => {
            this._SfButtonBack.addEventListener('click', () => {
                this.mode = "view";
                this.loadMode();
            });
            this._sfButtonSubmit.addEventListener('click', () => {
                this.submitNew();
            });
            for (var i = 0; i < this.getInputs().length; i++) {
                const element = this._sfSlottedForm[0].querySelector('#' + this.getInputs()[i]);
                if (element.nodeName.toLowerCase() == "sf-i-select") {
                    element.addEventListener('valueChanged', () => {
                        this.evalSubmit();
                        this.processFiltersByEvent();
                    });
                }
                else if (element.nodeName.toLowerCase() == "sf-i-sub-select") {
                    element.addEventListener('valueChanged', () => {
                        this.evalSubmit();
                        this.processFiltersByEvent();
                    });
                }
                else if (element.nodeName.toLowerCase() == "sf-i-form") {
                    element.addEventListener('valueChanged', () => {
                        this.evalSubmit();
                        this.processFiltersByEvent();
                    });
                }
                else if (element.nodeName.toLowerCase() == "sf-i-uploader") {
                    element.addEventListener('uploadValid', () => {
                        this.evalSubmit();
                        this.processFiltersByEvent();
                    });
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
                }
                else if (element.nodeName.toLowerCase() == "select") {
                    element.addEventListener('change', () => {
                        this.evalSubmit();
                        this.processFiltersByEvent();
                        console.log("select changed");
                    });
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
                }
                else {
                    element.addEventListener('keyup', () => {
                        this.evalSubmit();
                        this.processFiltersByEvent();
                    });
                }
            }
        };
        this.initListenersSearch = () => {
            if (this._sfInputSearchSelect != null) {
                this._sfInputSearchSelect.addEventListener('keyup', (e) => {
                    if (e.key.toLowerCase() == "enter") {
                        this.searchPhrase = this.searchPhraseOriginal + '&(' + (this._sfInputSearchSelect.value + "|" + this._sfInputSearchSelect.value.toLowerCase() + "|" + this._sfInputSearchSelect.value.toUpperCase()) + ")";
                        console.log(this.searchPhrase);
                        this.prevCursor = [];
                        this.nextCursor = [];
                        this.fetchSearchSelect();
                    }
                    else {
                        console.log(e);
                    }
                });
            }
        };
        this.initListenersDetail = () => {
            var _a;
            this._SfButtonBack.addEventListener('click', () => {
                this.mode = "view";
                this.prevCursor = [];
                this.nextCursor = [];
                this.loadMode();
            });
            if (this._SfButtonEdit != null) {
                this._SfButtonEdit.addEventListener('click', () => {
                    this.disableEdit(false);
                    this.initDisableInputs(false);
                });
            }
            if (this._SfButtonEditCancel != null) {
                this._SfButtonEditCancel.addEventListener('click', () => {
                    this.disableEdit(true);
                    this.initDisableInputs(true);
                });
            }
            if (this._SfButtonDelete != null) {
                this._SfButtonDelete.addEventListener('click', () => {
                    this.disableConfirm(false);
                });
            }
            if (this._SfButtonDeleteCancel != null) {
                this._SfButtonDeleteCancel.addEventListener('click', () => {
                    this.disableConfirm(true);
                });
            }
            if (this._sfButtonSubmit != null) {
                (_a = this._sfButtonSubmit) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
                    console.log('submit clicked');
                    this.submitEdit();
                });
            }
            if (this._SfButtonDeleteConfirm != null) {
                this._SfButtonDeleteConfirm.addEventListener('click', () => {
                    this.submitDelete();
                });
            }
            if (this._sfButtonCalendar != null) {
                this._sfButtonCalendar.addEventListener('click', () => {
                    this.disableCalendar(false);
                });
            }
            if (this._sfButtonCalendarCancel != null) {
                this._sfButtonCalendarCancel.addEventListener('click', () => {
                    this.disableCalendar(true);
                });
            }
            for (var i = 0; i < this.getInputs().length; i++) {
                const element = this._sfSlottedForm[0].querySelector('#' + this.getInputs()[i]);
                let index = i;
                if (element.nodeName.toLowerCase() == "sf-i-select") {
                    element.addEventListener('valueChanged', () => {
                        console.log('value changed', element.nodeName.toLowerCase(), element.value);
                        this.updateComment(index, element.selectedTexts());
                        this.evalSubmit();
                        this.processFiltersByEvent();
                    });
                }
                else if (element.nodeName.toLowerCase() == "sf-i-sub-select") {
                    element.addEventListener('valueChanged', () => {
                        this.updateComment(index, element.selectedTexts());
                        this.evalSubmit();
                        this.processFiltersByEvent();
                    });
                }
                else if (element.nodeName.toLowerCase() == "sf-i-form") {
                    element.addEventListener('valueChanged', () => {
                        this.updateComment(index, element.selectedTexts());
                        this.evalSubmit();
                        this.processFiltersByEvent();
                    });
                }
                else if (element.nodeName.toLowerCase() == "sf-i-uploader") {
                    element.addEventListener('uploadValid', () => {
                        this.evalSubmit();
                        this.processFiltersByEvent();
                    });
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
                }
                else if (element.nodeName.toLowerCase() == "select") {
                    element.addEventListener('change', () => {
                        this.updateComment(index, element.options[element.selectedIndex].text);
                        this.evalSubmit();
                        this.processFiltersByEvent();
                        console.log("select changed");
                    });
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
                }
                else {
                    element.addEventListener('keyup', () => {
                        this.evalSubmit();
                        this.processFiltersByEvent();
                    });
                }
            }
        };
        this.updateComment = (index, newValue) => {
            if (this.mode == "new") {
                return;
            }
            if (newValue == '') {
                return;
            }
            let oldText = this._sfSlottedForm[0].querySelector('#sf-i-changes').innerHTML;
            let fieldName = this.getFields()[index];
            let splitArr = oldText.split('(');
            let entryFound = false;
            for (let [i, splitStr] of splitArr.entries()) {
                if (splitStr.indexOf(`${fieldName} changed to`) >= 0) {
                    splitArr[i] = `${fieldName} changed to ${newValue})`;
                    entryFound = true;
                }
            }
            if (!entryFound) {
                splitArr.push(`${fieldName} changed to ${newValue})`);
            }
            this._sfSlottedForm[0].querySelector('#sf-i-changes').innerHTML = splitArr.join('(');
        };
        this.populateSelectedViewToDetailValues = () => {
            console.log('populating selected', this.getSelectedViewToDetailValues());
            for (var i = 0; i < this.getInputs().length; i++) {
                const element = this._sfSlottedForm[0].querySelector('#' + this.getInputs()[i]);
                const val = this.selectedTicketDetails[this.getFields()[i]];
                console.log('populating detail', element, element.nodeName.toLowerCase(), val);
                if (element.nodeName.toLowerCase() == "sf-i-select") {
                    element.selectedId = this.getSelectedViewToDetailValues()[i];
                    element.loadMode();
                }
                else if (element.nodeName.toLowerCase() == "sf-i-sub-select") {
                    element.selectedId = this.getSelectedViewToDetailValues()[i];
                    element.loadMode();
                }
                else if (element.nodeName.toLowerCase() == "sf-i-form") {
                    if (element.id == "sf-i-project") {
                        console.log("input project val", val, element, element.flow);
                    }
                    element.selectedSearchId = val.value[0] == null ? [] : [val.value[0]];
                    console.log('SFIFORM_load_Mode', 5, element.id);
                    element.loadMode();
                    console.log('populating selected', element.selectedSearchId, element);
                }
                else if (element.nodeName.toLowerCase() == "sf-i-uploader") {
                    // (element as SfIUploader).prepopulatedInputArr = JSON.stringify(this.getSelectedViewToDetailValues()[i]);
                    // (element as SfIUploader).loadMode();
                }
                else if (element.nodeName.toLowerCase() == "select") {
                    element.value = val.value;
                }
                else if (this.getFields()[i] == 'comments') {
                    console.log("populating comments", val);
                    let html = ``;
                    let tempVal = val;
                    tempVal.sort(function (a, b) {
                        var keyA = a.timestamp, keyB = b.timestamp;
                        // Compare the 2 timestamps
                        if (keyA > keyB)
                            return -1;
                        if (keyA < keyB)
                            return 1;
                        return 0;
                    });
                    for (var j = 0; j < tempVal.length; j++) {
                        console.log('populating comments 1', this.selectedTicketDetails['initiator'].value, tempVal[j]['userid']);
                        if (tempVal[j]['userid'] == this.userid) {
                            html += `<div part="comment-user" class="comment-user d-flex align-start flex-wrap flex-col">`;
                        }
                        else {
                            html += `<div part="comment-user" class="comment-user d-flex align-start flex-wrap flex-col align-self-end">`;
                        }
                        html += `<p part="comment-user-content" class="comment-user-content">${tempVal[j]['content']['value']}</p>`;
                        if (tempVal[j]['attachment'] != null) {
                            html += `<sf-i-uploader id="sf-i-comment-attachment-${j}" part="comment-user-attachment" class="comment-user-attachment" max="10" apiid="1peg5170d3" allowedextensions="[&quot;jpg&quot;,&quot;png&quot;]" extract="no" mode="view" maximize="yes"></sf-i-uploader>`;
                        }
                        html += `<p part="comment-user-name" class="comment-user-name">${tempVal[j]['username']}</p>`;
                        let createDate = new Date(parseInt(tempVal[j]['timestamp']));
                        html += `<p part="comment-user-timestamp" class="comment-user-timestamp">${createDate.toLocaleDateString()}-${createDate.toLocaleTimeString()}</p>`;
                        html += `</div>`;
                    }
                    console.log('comments populated', html);
                    element.innerHTML = html;
                    for (var j = 0; j < val.length; j++) {
                        if (val[j]['attachment'] != null) {
                            let uploaderElement = element.querySelector(`#sf-i-comment-attachment-${j}`);
                            uploaderElement.prepopulatedInputArr = JSON.stringify(tempVal[j]['attachment']['value']);
                            uploaderElement.loadMode();
                            console.log('comment uploader', uploaderElement, uploaderElement.prepopulatedInputArr);
                        }
                    }
                }
                else {
                    if (this.getSelectedViewToDetailValues()[i] != null) {
                        element.value = this.getSelectedViewToDetailValues()[i];
                        element.dispatchEvent(new Event('keyup'));
                    }
                }
            }
        };
        this.checkIfAlreadySelected = (value) => {
            const arrSelected = this._SfSearchMultiselectSelected.querySelectorAll('div');
            for (var i = 0; i < arrSelected.length; i++) {
                if (arrSelected[i].innerHTML == value) {
                    return true;
                }
            }
            return false;
        };
        this.populatePreselected = () => {
            this._SfSearchMultiselectSelected.innerHTML = '';
            for (var i = 0; i < this.getPreselectedValues().length; i++) {
                if (this.multiselectArr.indexOf(this.getPreselectedValues()[i]) < 0) {
                    console.log('pushing to multiselect', this.getPreselectedValues()[i], i);
                    this.multiselectArr.push(this.getPreselectedValues()[i]);
                }
                // if(!this.checkIfAlreadySelected(this.getPreselectedValues()[i])) {
                //   var html = '';
                //   html += '<div part="badge-multiselected" class="badge-multiselected">'+this.getPreselectedValues()[i]+'</div>';
                //   (this._SfSearchMultiselectSelected as HTMLDivElement).insertAdjacentHTML('beforeend', html);
                // }
            }
            this.completeSelect();
            console.log(this._SfSearchMultiselectSelected.innerHTML);
            if (this.getPreselectedValues().length > 0) {
                this._SfSearchMultiselectDelete.style.display = 'flex';
            }
            else {
                this._SfSearchMultiselectDelete.style.display = 'none';
            }
        };
        this.processDisabled = () => {
            for (var i = 0; i < this.getInputs().length; i++) {
                const element = this._sfSlottedForm[0].querySelector('#' + this.getInputs()[i]);
                if (this.mode == "view" || this.mode == "delete") {
                    element.setAttribute('disabled', true);
                }
            }
        };
        this.processUnitFiltersNew = () => {
            console.log('filters', this.getUnitFiltersNew().length, "select");
            for (var i = 0; i < this.getUnitFiltersNew().length; i++) {
                if (this.getUnitFiltersNew()[i].op == "select") {
                    const inputElement = this._SfFormC[0].querySelector('#' + this.getUnitFiltersNew()[i].input);
                    console.log('filters', inputElement, this.getUnitFiltersNew()[i], "select");
                    if (this.getUnitFiltersNew()[i].disable == "true") {
                        console.log('filters disabling', inputElement);
                        inputElement.setAttribute('disabled', "true");
                        continue;
                    }
                    const value = this.getUnitFiltersNew()[i].value;
                    console.log('filters', inputElement, value, "select");
                    if (inputElement.tagName.toLowerCase() == "sf-i-select") {
                        console.log('filters-select', "sf-i-select", value);
                        inputElement.selectedId = value;
                        inputElement.loadMode();
                    }
                    else if (inputElement.tagName.toLowerCase() == "sf-i-sub-select") {
                        console.log('filters-select', "sf-i-sub-select", value);
                        inputElement.selectedId = value;
                        inputElement.loadMode();
                    }
                    else if (inputElement.tagName.toLowerCase() == "sf-i-form") {
                        console.log('filters-select', "sf-i-form", value);
                        inputElement.selectedSearchId = value;
                        console.log('SFIFORM_load_Mode', 6);
                        inputElement.loadMode();
                    }
                    else {
                        inputElement.value = value;
                    }
                }
                if (this.getUnitFiltersNew()[i].op == "remove") {
                    const inputElement = this._SfFormC[0].querySelector('#' + this.getUnitFiltersNew()[i].input);
                    const value = this.getUnitFiltersNew()[i].value;
                    console.log('filters', inputElement, value, "remove");
                    if (inputElement.tagName.toLowerCase() == "sf-i-select") {
                        console.log('filters-remove', "sf-i-select", value);
                        inputElement.removeItemByValue(value);
                        inputElement.loadMode();
                    }
                    else if (inputElement.tagName.toLowerCase() == "sf-i-sub-select") {
                        console.log('filters-remove', "sf-i-sub-select", value);
                        inputElement.removeItemByValue(value);
                        inputElement.loadMode();
                    }
                    else if (inputElement.tagName.toLowerCase() == "sf-i-form") {
                        console.log('filters-remove', "sf-i-form", value);
                        inputElement.removeItemByValue(value);
                        console.log('SFIFORM_load_Mode', 7);
                        inputElement.loadMode();
                    }
                }
            }
        };
        this.processUnitFiltersDetail = () => {
            console.log('filters', this.getUnitFiltersDetail().length, "select");
            for (var i = 0; i < this.getUnitFiltersDetail().length; i++) {
                if (this.getUnitFiltersDetail()[i].op == "select") {
                    const inputElement = this._SfFormC[0].querySelector('#' + this.getUnitFiltersDetail()[i].input);
                    const value = this.getUnitFiltersDetail()[i].value;
                    console.log('filters', inputElement, value, "select");
                    if (inputElement.tagName.toLowerCase() == "sf-i-select") {
                        console.log('filters-select', "sf-i-select", value);
                        inputElement.selectedId = value;
                        inputElement.loadMode();
                    }
                    else if (inputElement.tagName.toLowerCase() == "sf-i-sub-select") {
                        console.log('filters-select', "sf-i-sub-select", value);
                        inputElement.selectedId = value;
                        inputElement.loadMode();
                    }
                    else if (inputElement.tagName.toLowerCase() == "sf-i-form") {
                        console.log('filters-select', "sf-i-form", value);
                        inputElement.selectedSearchId = value;
                        console.log('SFIFORM_load_Mode', 8);
                        inputElement.loadMode();
                    }
                }
                if (this.getUnitFiltersDetail()[i].op == "remove") {
                    const inputElement = this._SfFormC[0].querySelector('#' + this.getUnitFiltersDetail()[i].input);
                    const value = this.getUnitFiltersDetail()[i].value;
                    console.log('filters', inputElement, value, "remove");
                    if (inputElement.tagName.toLowerCase() == "sf-i-select") {
                        console.log('filters-remove', "sf-i-select", value);
                        inputElement.removeItemByValue(value);
                        inputElement.loadMode();
                    }
                    else if (inputElement.tagName.toLowerCase() == "sf-i-sub-select") {
                        console.log('filters-remove', "sf-i-sub-select", value);
                        inputElement.removeItemByValue(value);
                        inputElement.loadMode();
                    }
                    else if (inputElement.tagName.toLowerCase() == "sf-i-form") {
                        console.log('filters-remove', "sf-i-form", value);
                        inputElement.removeItemByValue(value);
                        console.log('SFIFORM_load_Mode', 9);
                        inputElement.loadMode();
                    }
                }
            }
        };
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
        this.renderNewAfterContentPopulated = () => {
            console.log('renderNewAfterContentPopulated');
            this.populateSelectedViewToDetailValues();
            // this.initListenersNew();
            this.processFormLayouting();
            this.clearUnitFilters();
            this.processUnitFiltersNew();
            // this.initListenerClipboardControls();
            if (this.mode == "consumer") {
                this.hideDelete();
                this.hideBack();
            }
        };
        this.renderDetailAfterContentPopulated = () => {
            this.populateSelectedViewToDetailValues();
            this.initListenersDetail();
            this.processFormLayouting();
            this.clearUnitFilters();
            this.processUnitFiltersDetail();
            // this.initListenerClipboardControls();
            if (this.mode == "consumer") {
                this.hideDelete();
                this.hideBack();
            }
        };
        this.loadMode = async () => {
            console.log('load mode sfiticketing', this.mode);
            if (this.mode == "multiselect-dropdown") {
                setTimeout(() => {
                    this.initListenersMultiselect();
                    this.populatePreselected();
                }, 500);
            }
            else if (this.mode == "text") {
                this.selectedTextPhrase = await this.fetchDetail();
            }
            else if (this.mode == "select" || this.mode == "list") {
                setTimeout(() => {
                    // this.initListenersTrail();
                    this.searchPhraseOriginal = this.searchPhrase;
                    console.log('searchPhrase loadmode', this.searchPhrase);
                    this.prevCursor = [];
                    this.nextCursor = [];
                    this.fetchSearchSelect();
                    this.initListenersSearch();
                }, 500);
            }
            else if (this.mode == "trail") {
                setTimeout(async () => {
                    this.initListenersTrail();
                    let d = new Date();
                    let [day, month, year] = Util.getDayMonthYear(d);
                    let lastWeek = new Date();
                    lastWeek.setDate(d.getDate() - 7);
                    let [lastday, lastmonth, lastyear] = Util.getDayMonthYear(lastWeek);
                    this._SfInputStartDate.value = "" + lastyear + "-" + lastmonth + "-" + lastday;
                    this._SfInputEndDate.value = "" + year + "-" + month + "-" + day;
                    this._SfInputEndDate.setAttribute('min', new Date(this._SfInputStartDate.value).toISOString().slice(0, 10));
                    this._SfInputStartDate.setAttribute('max', new Date(this._SfInputEndDate.value).toISOString().slice(0, 10));
                    this.fetchLogs();
                }, 500);
            }
            else if (this.mode == "latest") {
                setTimeout(async () => {
                    // this.initListenersTrail();
                    this.fetchLatest();
                }, 500);
            }
            else if (this.mode == "new") {
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
                }, 500);
            }
            else if (this.mode == "downloader") {
                setTimeout(() => {
                    this.initDecryptView();
                }, 500);
            }
            else if (this.mode == "view") {
                setTimeout(() => {
                    this.initSearchView();
                    this.initListenersView();
                    let d = new Date();
                    let [day, month, year] = Util.getDayMonthYear(d);
                    let lastWeek = new Date();
                    lastWeek.setDate(d.getDate() - 7);
                    let [lastday, lastmonth, lastyear] = Util.getDayMonthYear(lastWeek);
                    this._SfSearchStartDate.value = "" + lastyear + "-" + lastmonth + "-" + lastday;
                    this._SfSearchEndDate.value = "" + year + "-" + month + "-" + day;
                    this._SfSearchEndDate.setAttribute('min', new Date(this._SfSearchStartDate.value).toISOString().slice(0, 10));
                    this._SfSearchStartDate.setAttribute('max', new Date(this._SfSearchEndDate.value).toISOString().slice(0, 10));
                    if (!this.isAdmin()) {
                        let event = new Event('click');
                        this._sfButtonAll.dispatchEvent(event);
                    }
                    // this._sfInputSearch.value = this.searchPhrase == null ? "" : this.searchPhrase;
                    // var event = new Event('keyup');
                    // this._sfInputSearch.dispatchEvent(event);
                }, 500);
            }
            else if (this.mode == "detail" || (this.mode == "consumer" && this.selectedId.length != null && this.selectedId.length > 0)) {
                console.log('load mode detail');
                setTimeout(async () => {
                    console.log('load mode detail 1');
                    if (this._SfCalendarC != null && this._SfCalendarC[0] != null) {
                        this._SfCalendarC[0].querySelector('sf-i-events').apiIdList = this.apiId;
                        this._SfCalendarC[0].querySelector('sf-i-events').apiBodyList = "{\"id\": \"" + this.selectedId + "\"}";
                        this._SfCalendarC[0].querySelector('sf-i-events').loadMode();
                    }
                    await this.initShowInputs();
                    console.log("disabling edits 1", true);
                    this.disableEdit(true);
                    if (this.apiIdCalendarDetail != "") {
                        this.disableCalendar(true);
                    }
                    this.initDisableInputs(true, false);
                    this.processDependencies();
                    await this.fetchDetail();
                    this.renderDetailAfterContentPopulated();
                }, this.mode == "detail" ? 3000 : 3000);
            }
        };
        this.isAdmin = () => {
            return Util.readCookie('admin') == "true";
        };
    }
    firstUpdated(_changedProperties) {
        this.loadMode();
    }
    connectedCallback() {
        super.connectedCallback();
    }
    render() {
        console.log('form mode', this.mode, this.selectedId);
        if (this.mode == "multiselect-dropdown") {
            return html `
          
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
        }
        else if (this.mode == "list") {
            if (this.flow == "read") {
                return html `
          
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
            else {
                return html `
            
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
        }
        else if (this.mode == "read") {
            return html `
        
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
        }
        else if (this.mode == "latest") {
            return html `
        
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
        }
        else if (this.mode == "select") {
            if (this.flow == "read") {
                return html `

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
            else {
                return html `
        
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
        }
        else if (this.mode == "trail") {
            return html `
        
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
        }
        else if (this.mode == "new") {
            return html `
        
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
          <div class="d-flex justify-center">
            <div class="lb"></div>
            <div class="d-flex flex-grow justify-start">
              <button id="button-back" part="button-icon" class="button-icon"><span class="material-icons">keyboard_backspace</span></button>
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
        }
        else if (this.mode == "downloader") {
            return html `
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <div class="SfITicketingC">
        <div class="d-flex justify-center">
            <h1 part="title">${this.name}</h1>
        </div>
        <div id="decrypt-container" class="d-flex flex-col justify-center mt-20">
          <div class="d-flex mb-10">
            <div class="lb" part="lb"></div>
            <div class="d-flex align-end justify-between flex-grow">
              <div class="d-flex flex-col">
                <sf-i-form id="sf-i-project-decrypt" class="mr-10" name="Projects" label="Select Project *" apiid="dnytrdlrmxgsy.cloudfront.net/project" mode="multiselect-dropdown" selectprojection="name" searchphrase="" ignoreprojections="[&quot;locations&quot;,&quot;plan&quot;,&quot;logo&quot;,&quot;shortid&quot;,&quot;plan&quot;]" mandatory="">
                </sf-i-form>
              </div>
              <div class="d-flex flex-col">
                <label>Decrypt Utility</label>
                <div class="d-flex align-end">
                  <input part="input" id="input-decrypt" type="text" placeholder="file key" />.json&nbsp;&nbsp;
                  <button id="button-decrypt" part="button-icon-small" class="material-icons button-icon" disabled>download</button>
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
      `;
        }
        else if (this.mode == "view") {
            return html `
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <div class="SfITicketingC">
          <div class="d-flex justify-center">
              <h1 part="title">${this.name}</h1>
          </div>
          <div id="search-badge" class="d-flex justify-center">
            <div part="badge" class="badge">Search</div>
          </div>
          <div class="d-flex mt-20" id="search-filters-container">
            <div class="lb" part="lb"></div>
            <div class="d-flex align-stretch justify-between flex-col">
              <div class="d-flex align-center justify-between flex-grow row-gap-10 flex-wrap">
                <sf-i-form part="search-project" id="search-project" class="search-input" name="Project" label="Project" apiid="dnytrdlrmxgsy.cloudfront.net/project" mode="multiselect-dropdown" searchphrase="" selectprojection="name"></sf-i-form>
                <sf-i-form part="search-initiator" id="search-initiator" class="search-input" name="Initiated By" label="Initiated By" apiid="dnytrdlrmxgsy.cloudfront.net/userprofile" mode="multiselect-dropdown" searchphrase="" selectprojection="name"></sf-i-form>
                <sf-i-form part="search-assignedto" id="search-assignedto" class="search-input" name="Assigned To" label="Assigned To" apiid="dnytrdlrmxgsy.cloudfront.net/userprofile" mode="multiselect-dropdown" searchphrase="${this.adminProfileShortcode}" selectprojection="name"></sf-i-form>
              </div>
              <div class="d-flex align-center justify-between flex-grow row-gap-10 mt-20 flex-wrap">
                <div class="search-input d-flex flex-col justify-center align-stretch">
                  <label part="input-label">Category</label>
                  <div class="d-flex w-100-m-0">
                    <select class="w-100" part="input-select" id="search-category"><option value="noselect" disable="" hidden="">Select</option></select>
                  </div>
                </div>
                <div class="search-input d-flex flex-col justify-center align-stretch">
                  <label part="input-label">Priority</label>
                  <div class="d-flex w-100-m-0">
                    <select class="w-100" part="input-select" id="search-priority"><option value="noselect" disable="" hidden="">Select</option></select>
                  </div>
                </div>
                <div class="search-input d-flex flex-col justify-center align-stretch">
                  <label part="input-label">Status</label>
                  <div class="d-flex w-100-m-0">
                    <select class="w-100" part="input-select" id="search-status"><option value="noselect" disable="" hidden="">Select</option></select>
                  </div>
                </div>
              </div>
            </div>
            <div class="rb" part="rb"></div>
          </div>
          <div class="d-flex mt-20">
            <div class="lb" part="lb"></div>
            <div class="d-flex align-end justify-between mt-20">
              <div class="d-flex flex-col" part="date-filter-container">
                <div class="d-flex align-end pb-10">
                  <div class="w-50-m-0 mr-10" part="date-input-container">
                    <label part="input-label">From Date *</label><br>
                    <input part="input" id="search-startdate" type="date" class="w-100-m-0" mandatory="" autocomplete="off" style="display: block;">
                  </div>
                  <div class="w-50-m-0 mr-10" part="date-input-container">
                    <label part="input-label">To Date *</label><br>
                    <input part="input" id="search-enddate" type="date" class="w-100-m-0" mandatory="" autocomplete="off" style="display: block;">
                  </div>
                  <button id="button-all" part="button-icon" class="material-icons button-icon mr-10">filter_list</button>
                  <button id="button-new" part="button-icon" class="material-icons button-icon">add</button>
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
          <div class="d-flex">
            <div class="lb" part="lb"></div>
            <div id="search-list-container" class="flex-grow"></div>
            <div class="rb" part="rb"></div>
          </div>
        </div>
      `;
        }
        else if (this.mode == "text") {
            return html `
        <div class="SfITicketingC">
          <div>${this.selectedTextPhrase}<div class="loader-element"></div></div>
        </div>
      `;
        }
        else if (this.mode == "detail" || this.mode == "consumer") {
            return html `
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
        }
        else {
            return html `
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
};
// @property()
// selectedListSearchItemsValues: any[] = [];
// @property()
// selectedListSearchItemsTexts: any[] = [];
// @property()
// selectedValue = () => {
//   return this._SfInputSelect.value;
// }
SfITicketing.styles = css `

    
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
      justify-content: center;
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
    
    .badge-multiselected-name {
      font-size: 70%;
      padding: 5px;
      border-radius: 10px;
      border: solid 1px #dddddd;
      white-space: nowrap;
      overflow: hidden !important;
      min-width: 50px;
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

    .mt-20 {
      margin-top: 20px;
    }
    .mr-10 {
      margin-right: 10px;
    }
    .pb-10 {
      padding-bottom: 10px;
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
      vertical-align: middle !important
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

    .row-gap-10 {
      gap: 10px
    }

    sf-i-form::part(input-label){
      color: #740039
    }
    
    .no-records-message {
      width: 100%;
      text-align: center
    }

  `;
__decorate([
    property()
], SfITicketing.prototype, "mode", void 0);
__decorate([
    property()
], SfITicketing.prototype, "userid", void 0);
__decorate([
    property()
], SfITicketing.prototype, "username", void 0);
__decorate([
    property()
], SfITicketing.prototype, "flow", void 0);
__decorate([
    property()
], SfITicketing.prototype, "showCalendar", void 0);
__decorate([
    property()
], SfITicketing.prototype, "searchPhrase", void 0);
__decorate([
    property()
], SfITicketing.prototype, "selectProjection", void 0);
__decorate([
    property()
], SfITicketing.prototype, "selectAnotherProjection", void 0);
__decorate([
    property()
], SfITicketing.prototype, "ignoreProjections", void 0);
__decorate([
    property()
], SfITicketing.prototype, "dependencies", void 0);
__decorate([
    property()
], SfITicketing.prototype, "inputIds", void 0);
__decorate([
    property()
], SfITicketing.prototype, "fields", void 0);
__decorate([
    property()
], SfITicketing.prototype, "validations", void 0);
__decorate([
    property()
], SfITicketing.prototype, "selectedViewToDetailValues", void 0);
__decorate([
    property()
], SfITicketing.prototype, "useInApi", void 0);
__decorate([
    property()
], SfITicketing.prototype, "unitFiltersNew", void 0);
__decorate([
    property()
], SfITicketing.prototype, "unitFiltersDetail", void 0);
__decorate([
    queryAssignedElements({ slot: 'form' })
], SfITicketing.prototype, "_sfSlottedForm", void 0);
__decorate([
    property()
], SfITicketing.prototype, "apiId", void 0);
__decorate([
    property()
], SfITicketing.prototype, "apiIdCalendarDetail", void 0);
__decorate([
    property()
], SfITicketing.prototype, "searchIndex", void 0);
__decorate([
    property()
], SfITicketing.prototype, "selectedId", void 0);
__decorate([
    property()
], SfITicketing.prototype, "selectedProjectId", void 0);
__decorate([
    property()
], SfITicketing.prototype, "selectedTicketDetails", void 0);
__decorate([
    property()
], SfITicketing.prototype, "selectedSearchId", void 0);
__decorate([
    property()
], SfITicketing.prototype, "searchParams", void 0);
__decorate([
    property()
], SfITicketing.prototype, "searchInputIds", void 0);
__decorate([
    property()
], SfITicketing.prototype, "adminProfileShortcode", void 0);
__decorate([
    property()
], SfITicketing.prototype, "preselectedValues", void 0);
__decorate([
    property()
], SfITicketing.prototype, "label", void 0);
__decorate([
    property()
], SfITicketing.prototype, "latestDaysBlock", void 0);
__decorate([
    property()
], SfITicketing.prototype, "name", void 0);
__decorate([
    property()
], SfITicketing.prototype, "shortlistedSearchPhrases", void 0);
__decorate([
    property()
], SfITicketing.prototype, "removedValues", void 0);
__decorate([
    property()
], SfITicketing.prototype, "selectedTextPhrase", void 0);
__decorate([
    property()
], SfITicketing.prototype, "projectField", void 0);
__decorate([
    property()
], SfITicketing.prototype, "prevCursor", void 0);
__decorate([
    property()
], SfITicketing.prototype, "nextCursor", void 0);
__decorate([
    property()
], SfITicketing.prototype, "noLatestMessage", void 0);
__decorate([
    property()
], SfITicketing.prototype, "titleMessage", void 0);
__decorate([
    property()
], SfITicketing.prototype, "multiselectArr", void 0);
__decorate([
    property()
], SfITicketing.prototype, "decryptProjectId", void 0);
__decorate([
    property()
], SfITicketing.prototype, "decryptFileName", void 0);
__decorate([
    property()
], SfITicketing.prototype, "searchFilterIds", void 0);
__decorate([
    query('#button-submit')
], SfITicketing.prototype, "_sfButtonSubmit", void 0);
__decorate([
    query('#button-all')
], SfITicketing.prototype, "_sfButtonAll", void 0);
__decorate([
    query('#button-calendar-cancel')
], SfITicketing.prototype, "_sfButtonCalendarCancel", void 0);
__decorate([
    query('#button-calendar')
], SfITicketing.prototype, "_sfButtonCalendar", void 0);
__decorate([
    query('#input-select')
], SfITicketing.prototype, "_sfInputSelect", void 0);
__decorate([
    query('#select-search-input')
], SfITicketing.prototype, "_sfInputSearchSelect", void 0);
__decorate([
    query('#input-list')
], SfITicketing.prototype, "_sfInputList", void 0);
__decorate([
    query('#sf-button-delete')
], SfITicketing.prototype, "_sfButtonDelete", void 0);
__decorate([
    query('.div-row-error')
], SfITicketing.prototype, "_SfRowError", void 0);
__decorate([
    query('.div-row-error-message')
], SfITicketing.prototype, "_SfRowErrorMessage", void 0);
__decorate([
    query('.div-row-success')
], SfITicketing.prototype, "_SfRowSuccess", void 0);
__decorate([
    query('.div-row-success-message')
], SfITicketing.prototype, "_SfRowSuccessMessage", void 0);
__decorate([
    query('.div-row-notif')
], SfITicketing.prototype, "_SfRowNotif", void 0);
__decorate([
    query('.div-row-notif-message')
], SfITicketing.prototype, "_SfRowNotifMessage", void 0);
__decorate([
    query('.loader-element')
], SfITicketing.prototype, "_SfLoader", void 0);
__decorate([
    query('#form-container')
], SfITicketing.prototype, "_SfFormContainer", void 0);
__decorate([
    query('#calendar-container')
], SfITicketing.prototype, "_SfCalendarContainer", void 0);
__decorate([
    query('#search-list-container')
], SfITicketing.prototype, "_SfSearchListContainer", void 0);
__decorate([
    query('#search-select-container')
], SfITicketing.prototype, "_SfSearchSelectContainer", void 0);
__decorate([
    query('#search-filters-container')
], SfITicketing.prototype, "_SfSearchFiltersContainer", void 0);
__decorate([
    query('#search-badge')
], SfITicketing.prototype, "_SfSearchBadge", void 0);
__decorate([
    query('#search-startdate')
], SfITicketing.prototype, "_SfSearchStartDate", void 0);
__decorate([
    query('#search-enddate')
], SfITicketing.prototype, "_SfSearchEndDate", void 0);
__decorate([
    query('#logs-list-container')
], SfITicketing.prototype, "_SfLogsListContainer", void 0);
__decorate([
    query('#latest-list-container')
], SfITicketing.prototype, "_SfLatestListContainer", void 0);
__decorate([
    query('#button-back')
], SfITicketing.prototype, "_SfButtonBack", void 0);
__decorate([
    query('#button-edit')
], SfITicketing.prototype, "_SfButtonEdit", void 0);
__decorate([
    query('#button-delete')
], SfITicketing.prototype, "_SfButtonDelete", void 0);
__decorate([
    query('#button-new')
], SfITicketing.prototype, "_SfButtonNew", void 0);
__decorate([
    query('#button-delete-confirm')
], SfITicketing.prototype, "_SfButtonDeleteConfirm", void 0);
__decorate([
    query('#search-multiselect-select')
], SfITicketing.prototype, "_SfSearchMultiselectSelect", void 0);
__decorate([
    query('#search-multiselect-input')
], SfITicketing.prototype, "_SfSearchMultiselectInput", void 0);
__decorate([
    query('#search-multiselect-delete')
], SfITicketing.prototype, "_SfSearchMultiselectDelete", void 0);
__decorate([
    query('#search-multiselect-selected')
], SfITicketing.prototype, "_SfSearchMultiselectSelected", void 0);
__decorate([
    query('#button-edit-cancel')
], SfITicketing.prototype, "_SfButtonEditCancel", void 0);
__decorate([
    query('#button-delete-cancel')
], SfITicketing.prototype, "_SfButtonDeleteCancel", void 0);
__decorate([
    query('#sf-i-events')
], SfITicketing.prototype, "_SfIEvents", void 0);
__decorate([
    query('#input-startdate')
], SfITicketing.prototype, "_SfInputStartDate", void 0);
__decorate([
    query('#input-enddate')
], SfITicketing.prototype, "_SfInputEndDate", void 0);
__decorate([
    query('#button-fetch-log')
], SfITicketing.prototype, "_SfButtonFetchLog", void 0);
__decorate([
    queryAssignedElements({ slot: 'form' })
], SfITicketing.prototype, "_SfFormC", void 0);
__decorate([
    queryAssignedElements({ slot: 'calendar' })
], SfITicketing.prototype, "_SfCalendarC", void 0);
__decorate([
    query('#decrypt-container')
], SfITicketing.prototype, "_SfDecryptContainer", void 0);
__decorate([
    query('#sf-i-project-decrypt')
], SfITicketing.prototype, "_SfDecryptProjectInput", void 0);
__decorate([
    query('#input-decrypt')
], SfITicketing.prototype, "_SfDecryptFileInput", void 0);
__decorate([
    query('#button-decrypt')
], SfITicketing.prototype, "_SfDecryptButton", void 0);
SfITicketing = __decorate([
    customElement('sf-i-ticketing')
], SfITicketing);
export { SfITicketing };
//# sourceMappingURL=sf-i-ticketing.js.map
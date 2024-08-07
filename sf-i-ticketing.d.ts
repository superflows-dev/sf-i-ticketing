/**
 * @license
 * Copyright 2022 Superflow.dev
 * SPDX-License-Identifier: MIT
 */
import { LitElement, PropertyValueMap } from 'lit';
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
export declare class SfITicketing extends LitElement {
    searchPhraseOriginal: string;
    blockSize: number;
    VALIDATION_TEXT_BASIC: string;
    VALIDATION_TEXT_DATE: string;
    VALIDATION_SELECT: string;
    mode: string;
    userid: string;
    username: string;
    flow: string;
    showCalendar: boolean;
    searchPhrase: string;
    selectProjection: string;
    selectAnotherProjection: string;
    ignoreProjections: string;
    getIgnoreProjections: () => any;
    dependencies: string;
    inputIds: string;
    fields: string;
    validations: string;
    selectedViewToDetailValues: string;
    useInApi: string;
    unitFiltersNew: string;
    unitFiltersDetail: string;
    _sfSlottedForm: any;
    apiId: string;
    apiIdCalendarDetail: string;
    searchIndex: string;
    selectedId: string;
    selectedProjectId: string;
    selectedTicketDetails: any;
    selectedSearchId: string[];
    searchParams: any;
    searchInputIds: string;
    preselectedValues: string;
    getPreselectedValues: () => any;
    label: string;
    latestDaysBlock: number;
    name: string;
    shortlistedSearchPhrases: any;
    removedValues: string[];
    selectedTextPhrase: string;
    projectField: string;
    prevCursor: Array<any>;
    nextCursor: Array<any>;
    noLatestMessage: string;
    titleMessage: string;
    multiselectArr: Array<string>;
    decryptProjectId: string;
    decryptFileName: string;
    selectedValues: () => any[];
    selectedTexts: () => any[];
    searchFilterIds: any[];
    static styles: import("lit").CSSResult;
    _sfButtonSubmit: any;
    _sfButtonAll: any;
    _sfButtonCalendarCancel: any;
    _sfButtonCalendar: any;
    _sfInputSelect: any;
    _sfInputSearchSelect: any;
    _sfInputList: any;
    _sfButtonDelete: any;
    _SfRowError: any;
    _SfRowErrorMessage: any;
    _SfRowSuccess: any;
    _SfRowSuccessMessage: any;
    _SfRowNotif: any;
    _SfRowNotifMessage: any;
    _SfLoader: any;
    _SfFormContainer: any;
    _SfCalendarContainer: any;
    _SfSearchListContainer: any;
    _SfSearchSelectContainer: any;
    _SfSearchFiltersContainer: any;
    _SfSearchBadge: any;
    _SfSearchStartDate: any;
    _SfSearchEndDate: any;
    _SfLogsListContainer: any;
    _SfLatestListContainer: any;
    _SfButtonBack: any;
    _SfButtonEdit: any;
    _SfButtonDelete: any;
    _SfButtonNew: any;
    _SfButtonDeleteConfirm: any;
    _SfSearchMultiselectSelect: any;
    _SfSearchMultiselectInput: any;
    _SfSearchMultiselectDelete: any;
    _SfSearchMultiselectSelected: any;
    _SfButtonEditCancel: any;
    _SfButtonDeleteCancel: any;
    _SfIEvents: any;
    _SfInputStartDate: any;
    _SfInputEndDate: any;
    _SfButtonFetchLog: any;
    _SfFormC: any;
    _SfCalendarC: any;
    _SfDecryptContainer: any;
    _SfDecryptProjectInput: any;
    _SfDecryptFileInput: any;
    _SfDecryptButton: any;
    getInputFromField: (field: string) => any;
    getFieldFromInput: (input: string) => any;
    getUseInApi: () => any;
    getUnitFiltersNew: () => any;
    getUnitFiltersDetail: () => any;
    getSelectedViewToDetailValues: () => any;
    getFields: () => any;
    getValidations: () => any;
    getDependencies: () => any;
    getInputs: () => any;
    dispatchMyEvent: (ev: string, args?: any) => void;
    onChangeSelect: (ev: any) => void;
    clearSelection: () => void;
    getSelectedSearchText: () => any;
    getInputValue: (id: string) => {
        type: string;
        value: any[];
        text: any[];
    } | {
        type: string;
        value: string;
        text: string;
    } | {
        type: string;
        value: any;
        text?: undefined;
    };
    prepareXhr: (data: any, url: string, loaderElement: any, authorization: any) => Promise<unknown>;
    clearMessages: () => void;
    setError: (msg: string) => void;
    setSuccess: (msg: string) => void;
    setNotif: (msg: string) => void;
    setListSelection: (value: string, text: string) => void;
    clickTableNextList: (cursor: any) => void;
    clickTableNext: (cursor: any) => void;
    clickTablePrev: () => void;
    renderSearch: (values: any) => void;
    renderListRows: (values: any, multiSelect: boolean) => string;
    renderList: (values: any, found: any, cursor: any, multiSelect?: boolean) => void;
    renderLogs: (values: any) => void;
    renderLatestListRows: (values: any) => string;
    renderLatest: (values: any) => void;
    renderMastersSearch: (values: any) => void;
    renderMasters: (values: any) => Promise<void>;
    renderDetail: (value: any) => void;
    renderSearchMultiselect: (values: Array<any>) => void;
    getSearchFilter: () => Record<any, any>;
    fetchSearch: (cursor?: any) => Promise<void>;
    fetchSearchMultiselect: (cursor?: any) => Promise<void>;
    fetchSearchSelect: (cursor?: any) => Promise<void>;
    fetchSearchList: (cursor?: any) => Promise<void>;
    fetchDetail: () => Promise<any>;
    fetchLogs: () => Promise<void>;
    fetchLatest: () => Promise<void>;
    fetchMasters: (successCallback: Function) => Promise<void>;
    submitDelete: () => Promise<void>;
    submitNew: () => Promise<void>;
    submitEdit: () => Promise<void>;
    populateValues: () => any;
    getValidationOfElement: (id: string) => any;
    evalSubmit: () => void;
    disableConfirm: (value: boolean) => void;
    disableCalendar: (value: boolean) => void;
    disableEdit: (value: boolean) => void;
    hideDelete: () => void;
    hideBack: () => void;
    formatShortlistedSearchPhrase: () => void;
    updateShortlistedSearchPhrase: (parents: any, childElement: any) => void;
    processDependencies: () => void;
    initShowInputs: () => Promise<void>;
    initDisableInputs: (value: boolean, reload?: boolean) => void;
    clearInputs: () => void;
    removeItemByValue: (value: string) => void;
    processFormLayouting: () => void;
    fWait: (ms: number) => Promise<unknown>;
    checkButtonState: boolean;
    checkButtonStates: () => void;
    loopThroughSearchResults: () => Promise<void>;
    initSearchView: () => void;
    populateSearchFilterValues: () => void;
    initDecryptView: () => void;
    initDecryptListeners: () => void;
    evalDecrypt: () => void;
    submitDecrypt: () => Promise<void>;
    initListenersView: () => void;
    initListenersTrail: () => Promise<void>;
    clearUnitFilters: () => void;
    processFiltersByEvent: () => void;
    completeSelect: () => void;
    removeFromMultiselect: (index: number) => void;
    initListenersMultiselect: () => void;
    initPrepopulateNew: () => void;
    initListenersNew: () => void;
    initListenersSearch: () => void;
    initListenersDetail: () => void;
    populateSelectedViewToDetailValues: () => void;
    checkIfAlreadySelected: (value: string) => boolean;
    populatePreselected: () => void;
    processDisabled: () => void;
    processUnitFiltersNew: () => void;
    processUnitFiltersDetail: () => void;
    renderNewAfterContentPopulated: () => void;
    renderDetailAfterContentPopulated: () => void;
    loadMode: () => Promise<void>;
    isAdmin: () => boolean;
    constructor();
    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void;
    connectedCallback(): void;
    render(): import("lit").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sf-i-ticketing': SfITicketing;
    }
}
//# sourceMappingURL=sf-i-ticketing.d.ts.map
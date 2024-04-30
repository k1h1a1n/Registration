export class TableConfig {   
    tableHeader?:string; // Table Header
    
    // On Header displaying Add button, Filter Table button and Table Rows Delete button
    isAdd?:boolean; // Master Screen Add Button
    isFilterTable?:boolean; // Master Screen Filter table button
    isMultiDelete?:boolean; // Multiple Rows Delete 
    
    isSingleSelection?:boolean; // Single Row Selection
    isMultiSelect?:boolean; // Multiple Rows Selection

    contextMenu?:{edit?: boolean, delete?: boolean}; // Context Menu
    rowActions?:{edit?: boolean, delete?: boolean}; // In Row Buttons
    isColumnScrollable?:boolean;
    isBack?:boolean;
    pageOptions?:{
        pageSize: number;
        /** The set of provided page size options to display to the user. */
        pageSizeOptions: number[];
        /** Whether to hide the page size selection UI from the user. */
        hidePageSize?: boolean;
        /** Whether to show the first/last buttons UI to the user. */
        showFirstLastButtons?: boolean;
    };
    defaultSort?: { active: string, direction: any };
    isRowChecked?: any;
    onChangeSelection?: any;
}

export class ColumnConfig {
    name?: string;
    label?: string;
    type?: string = 'string';
    values?: any;
    isHyperlink?:boolean;
}
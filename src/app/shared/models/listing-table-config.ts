export interface ListingTableConfig {   
    usedFor:string;
    minHeight:string;
    noDataLabel: string;
    columnConfig:Array<{header : string , property : string , pipe : string , sortable? : boolean}>;
    // optional
    contextMenu?:{edit: boolean, delete: boolean, copy: boolean, print: boolean};
    defaultSortingConfig?:{active : string ,direction: any};
    isFilterTable?:boolean;
    isAdd?:boolean;
    isMultiDelete?:boolean;
    isSingleSelection?:boolean;
    emitOnRowclick?:boolean;
    isDialog?:boolean;
    pageOptions?:{
        pageSize: number;
        /** The set of provided page size options to display to the user. */
        pageSizeOptions: number[];
        /** Whether to hide the page size selection UI from the user. */
        hidePageSize?: boolean;
        /** Whether to show the first/last buttons UI to the user. */
        showFirstLastButtons?: boolean;
    };
}

import { toast } from "react-toastify";

export function onDeleteSuccess(message) {
    // Stryker disable all
    console.log(message);
    toast(message);
    // Stryker restore all
}

export function cellToAxiosParamsDelete(cell) {
    return {
        url: "/api/ucsbdiningcommonsmenuitem/",
        method: "DELETE",
        params: {
            id: cell.row.values.id
        }
    }
}


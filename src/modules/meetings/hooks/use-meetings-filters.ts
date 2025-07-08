import { DEFAULT_PAGE_NUM } from "@/constants";
import { meetingStatus } from "@/db/schema";
import { parseAsInteger,parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

export const useMeetingsFilters = ()=>{
    return useQueryStates({
        search: parseAsString.withDefault("").withOptions({clearOnDefault:true}),
        page: parseAsInteger.withDefault(DEFAULT_PAGE_NUM).withOptions({clearOnDefault:true}),
        status: parseAsStringEnum(meetingStatus.enumValues).withOptions({clearOnDefault:true}),
    })
}
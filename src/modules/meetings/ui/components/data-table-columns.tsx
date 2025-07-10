"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MeetingGetOne } from "../../types"



// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<MeetingGetOne>[] = [
  {
    accessorKey: "name",
    header: "Meeting Name",
    cell: ({row})=>(
      <div className="flex flex-col gap-y-1">
        <div className="flex items-center gap-x-2 ">
          <span className="font-semibold capitalize">{row.original.name}</span>
        </div>
        
          <div className="flex items-center gap-x-2">
            <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">{row.original.status}</span>
          </div>

          <div className="flex items-center gap-x-2">
            <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">{row.original.agentId}</span>
          </div>
        
      </div>
    )
  },
  // {
  //   accessorKey: "meetingCount",
  //   header: "Meetings",
  //   cell:({row})=>(
  //     <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4">
  //       <VideoIcon className="text-blue-700"/>

  //        {/*row.original.meetingCount} {row.original.meetingCount === 1 ? "meeting":"meetings" */}
  //     </Badge>
  //   )
  // },
]

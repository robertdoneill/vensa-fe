import { IconCheck, IconAlertCircle } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

interface CUEC {
  id: string
  text: string
  category: string
  mappedControl: string
  comment: string
  status: "mapped" | "unmapped"
}

interface InternalControlTest {
  id: string
  name: string
  category: string
}

interface CUECMappingTableProps {
  cuecs: CUEC[]
  internalControlTests: InternalControlTest[]
  onUpdateMapping: (cuecId: string, field: "mappedControl" | "comment", value: string) => void
}

export function CUECMappingTable({ 
  cuecs, 
  internalControlTests, 
  onUpdateMapping 
}: CUECMappingTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CUEC Mappings</CardTitle>
        <CardDescription>
          Map each CUEC to your internal control tests
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">CUEC Description</TableHead>
                <TableHead className="w-[25%]">Internal Control Test</TableHead>
                <TableHead className="w-[25%]">Comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cuecs.map((cuec) => (
                <TableRow key={cuec.id}>
                  <TableCell className="align-top">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Badge
                          variant={cuec.status === "mapped" ? "default" : "outline"}
                          className={
                            cuec.status === "mapped"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "text-orange-700 border-orange-200"
                          }
                        >
                          {cuec.status === "mapped" ? (
                            <>
                              <IconCheck className="h-3 w-3 mr-1" />
                              Mapped
                            </>
                          ) : (
                            <>
                              <IconAlertCircle className="h-3 w-3 mr-1" />
                              Unmapped
                            </>
                          )}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {cuec.category}
                        </Badge>
                      </div>
                      <p className="text-sm leading-relaxed">{cuec.text}</p>
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <Select
                      value={cuec.mappedControl || "none"}
                      onValueChange={(value) => 
                        onUpdateMapping(cuec.id, "mappedControl", value === "none" ? "" : value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select control test" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No mapping</SelectItem>
                        {internalControlTests.map((control) => (
                          <SelectItem key={control.id} value={control.id}>
                            <div className="space-y-1">
                              <div className="font-medium text-sm">
                                {control.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {control.id} • {control.category}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="align-top">
                    <Textarea
                      placeholder="Add mapping notes..."
                      value={cuec.comment}
                      onChange={(e) => onUpdateMapping(cuec.id, "comment", e.target.value)}
                      className="min-h-[60px] text-sm resize-none"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
import * as React from "react"
import {
  IconFile,
  IconFileTypeDocx,
  IconFileTypePdf,
  IconFileTypeXls,
  IconMail,
  IconPhoto,
  IconZip,
  IconX,
  IconCalendar,
  IconUser,
  IconTag,
  IconLink,
  IconTable,
  IconFileText,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"

interface Evidence {
  id: string
  fileName: string
  fileType: string
  uploader: {
    id: string
    name: string
    email: string
  }
  uploadedDate: string
  status: string
  fileSize: string
  tags: string[]
  linkedControlTests: Array<{
    id: string
    name: string
    type: string
  }>
  parsedEvidence?: {
    id: string
    hasExtractedTables: boolean
    extractedText?: string
    tableCount?: number
  }
}

interface EvidenceDetailDrawerProps {
  evidence: Evidence | null
  isOpen: boolean
  onClose: () => void
}

const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case "excel":
      return <IconFileTypeXls className="h-6 w-6 text-green-600" />
    case "pdf":
      return <IconFileTypePdf className="h-6 w-6 text-red-600" />
    case "email":
      return <IconMail className="h-6 w-6 text-blue-600" />
    case "image":
      return <IconPhoto className="h-6 w-6 text-purple-600" />
    case "zip":
      return <IconZip className="h-6 w-6 text-yellow-600" />
    default:
      return <IconFile className="h-6 w-6 text-gray-600" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "parsed":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          Parsed
        </Badge>
      )
    case "processing":
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Processing
        </Badge>
      )
    case "pending":
      return <Badge variant="secondary">Pending</Badge>
    case "error":
      return <Badge variant="destructive">Error</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export function EvidenceDetailDrawer({ evidence, isOpen, onClose }: EvidenceDetailDrawerProps) {
  if (!evidence) return null

  const uploadDate = new Date(evidence.uploadedDate)

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DrawerTitle className="flex items-center space-x-3">
              {getFileIcon(evidence.fileType)}
              <span className="truncate">{evidence.fileName}</span>
            </DrawerTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <IconX className="h-4 w-4" />
            </Button>
          </div>
        </DrawerHeader>

        <div className="px-4 pb-6 space-y-6 overflow-y-auto">
          {/* File Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">File Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <IconFile className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">File Type:</span>
                  <span className="text-sm capitalize">{evidence.fileType}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <IconFile className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">File Size:</span>
                  <span className="text-sm">{evidence.fileSize}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <IconCalendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Uploaded:</span>
                  <span className="text-sm">
                    {uploadDate.toLocaleDateString()} at {uploadDate.toLocaleTimeString()}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <IconUser className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Uploaded By:</span>
                  <div className="text-sm">
                    <div>{evidence.uploader.name}</div>
                    <div className="text-muted-foreground">{evidence.uploader.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Status:</span>
                  {getStatusBadge(evidence.status)}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tags */}
          {evidence.tags.length > 0 && (
            <>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <IconTag className="h-5 w-5" />
                  <span>Tags</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {evidence.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Linked Control Tests */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <IconLink className="h-5 w-5" />
              <span>Linked Control Tests</span>
            </h3>
            {evidence.linkedControlTests.length > 0 ? (
              <div className="space-y-2">
                {evidence.linkedControlTests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{test.name}</div>
                      <div className="text-sm text-muted-foreground">ID: {test.id}</div>
                    </div>
                    <Badge variant="secondary">{test.type}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No control tests linked to this evidence.</p>
            )}
          </div>

          {/* Parsed Evidence */}
          {evidence.parsedEvidence && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Parsed Content</h3>
                
                <div className="space-y-3">
                  {evidence.parsedEvidence.hasExtractedTables && (
                    <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                      <IconTable className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Tables Extracted</div>
                        <div className="text-sm text-muted-foreground">
                          {evidence.parsedEvidence.tableCount} table(s) found and processed
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {evidence.parsedEvidence.extractedText && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <IconFileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Extracted Text:</span>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg text-sm">
                        {evidence.parsedEvidence.extractedText}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <Separator />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button>
              Download
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
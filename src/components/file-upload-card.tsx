import * as React from "react"
import { IconUpload, IconFileText, IconX } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface FileUploadCardProps {
  onFileUpload: (file: File) => void
  uploadedFile: File | null
  onRemoveFile: () => void
}

export function FileUploadCard({ onFileUpload, uploadedFile, onRemoveFile }: FileUploadCardProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onFileUpload(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    const file = event.dataTransfer.files?.[0]
    if (file && (file.type === "application/pdf" || file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      onFileUpload(file)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload SOC 2 Report</CardTitle>
        <CardDescription>
          Upload a SOC 2 report to extract CUECs for mapping
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!uploadedFile ? (
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center transition-colors hover:border-muted-foreground/50 cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <IconUpload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Upload SOC 2 Report</h3>
              <p className="text-muted-foreground">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                Supports PDF and Excel files
              </p>
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              variant="outline"
              className="mt-4"
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
            >
              Choose File
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <IconFileText className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemoveFile}
              className="h-8 w-8"
            >
              <IconX className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
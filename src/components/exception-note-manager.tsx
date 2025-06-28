import * as React from "react"
import { IconPlus, IconTrash, IconLoader2, IconEdit, IconMessageCircle } from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { exceptionsApi, type ExceptionNote, type Remediation } from "@/lib/api/exceptions"

interface ExceptionNoteManagerProps {
  exceptionId: number
  notes: ExceptionNote[]
  remediations: Remediation[]
  onNotesChange: () => void
}

export function ExceptionNoteManager({ 
  exceptionId, 
  notes, 
  remediations, 
  onNotesChange 
}: ExceptionNoteManagerProps) {
  const [isAddingNote, setIsAddingNote] = React.useState(false)
  const [isAddingRemediation, setIsAddingRemediation] = React.useState(false)
  const [newNote, setNewNote] = React.useState("")
  const [newRemediation, setNewRemediation] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleAddNote = async () => {
    if (!newNote.trim()) return

    try {
      setIsSubmitting(true)
      await exceptionsApi.createExceptionNote({
        exception: exceptionId,
        note: newNote.trim()
      })
      
      setNewNote("")
      setIsAddingNote(false)
      onNotesChange()
      toast.success("Note added successfully")
    } catch (error) {
      console.error('Failed to add note:', error)
      toast.error("Failed to add note")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddRemediation = async () => {
    if (!newRemediation.trim()) return

    try {
      setIsSubmitting(true)
      await exceptionsApi.createRemediation({
        exception: exceptionId,
        remediation: newRemediation.trim()
      })
      
      setNewRemediation("")
      setIsAddingRemediation(false)
      onNotesChange()
      toast.success("Remediation added successfully")
    } catch (error) {
      console.error('Failed to add remediation:', error)
      toast.error("Failed to add remediation")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteNote = async (noteId: number) => {
    try {
      await exceptionsApi.deleteExceptionNote(noteId)
      onNotesChange()
      toast.success("Note deleted successfully")
    } catch (error) {
      console.error('Failed to delete note:', error)
      toast.error("Failed to delete note")
    }
  }

  const handleDeleteRemediation = async (remediationId: number) => {
    try {
      await exceptionsApi.deleteRemediation(remediationId)
      onNotesChange()
      toast.success("Remediation deleted successfully")
    } catch (error) {
      console.error('Failed to delete remediation:', error)
      toast.error("Failed to delete remediation")
    }
  }

  return (
    <div className="space-y-6">
      {/* Notes Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <IconMessageCircle className="h-4 w-4" />
            Notes
            <Badge variant="secondary">{notes.length}</Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingNote(!isAddingNote)}
          >
            <IconPlus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAddingNote && (
            <div className="space-y-2">
              <Textarea
                placeholder="Enter your note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleAddNote}
                  disabled={isSubmitting || !newNote.trim()}
                >
                  {isSubmitting ? (
                    <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <IconPlus className="h-4 w-4 mr-2" />
                  )}
                  Add Note
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setIsAddingNote(false)
                    setNewNote("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {notes.length === 0 ? (
            <p className="text-muted-foreground text-sm">No notes added yet.</p>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="border rounded-lg p-3 bg-muted/20"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm">{note.note}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(note.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Remediations Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <IconEdit className="h-4 w-4" />
            Remediations
            <Badge variant="secondary">{remediations.length}</Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingRemediation(!isAddingRemediation)}
          >
            <IconPlus className="h-4 w-4 mr-2" />
            Add Remediation
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAddingRemediation && (
            <div className="space-y-2">
              <Textarea
                placeholder="Describe the remediation action..."
                value={newRemediation}
                onChange={(e) => setNewRemediation(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleAddRemediation}
                  disabled={isSubmitting || !newRemediation.trim()}
                >
                  {isSubmitting ? (
                    <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <IconPlus className="h-4 w-4 mr-2" />
                  )}
                  Add Remediation
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setIsAddingRemediation(false)
                    setNewRemediation("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {remediations.length === 0 ? (
            <p className="text-muted-foreground text-sm">No remediations added yet.</p>
          ) : (
            <div className="space-y-3">
              {remediations.map((remediation) => (
                <div
                  key={remediation.id}
                  className="border rounded-lg p-3 bg-green-50/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm">{remediation.remediation}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(remediation.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRemediation(remediation.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
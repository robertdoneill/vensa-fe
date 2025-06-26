import { useState, useEffect } from 'react';
import { Download, Link, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { evidenceApi, type Evidence, type ControlTest } from '@/lib/api/evidence';
import { API_BASE_URL } from '@/lib/api/config';

export function EvidenceList() {
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [controlTests, setControlTests] = useState<ControlTest[]>([]);
  const [selectedControlTest, setSelectedControlTest] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [evidence, tests] = await Promise.all([
        evidenceApi.list(),
        evidenceApi.getControlTests(),
      ]);
      setEvidenceList(evidence);
      setControlTests(tests);
    } catch (error) {
      toast.error('Failed to fetch evidence data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const linkToControlTest = async (evidenceId: string) => {
    if (!selectedControlTest) {
      toast.error('Please select a control test first');
      return;
    }

    try {
      await evidenceApi.linkToControlTest(evidenceId, selectedControlTest);
      toast.success('Evidence linked to control test successfully');
    } catch (error) {
      toast.error('Failed to link evidence to control test');
    }
  };

  const getFileTypeIcon = () => {
    return <FileText className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evidence Management</CardTitle>
        {controlTests.length > 0 && (
          <div className="mt-4">
            <Select value={selectedControlTest} onValueChange={setSelectedControlTest}>
              <SelectTrigger className="w-full sm:w-[300px]">
                <SelectValue placeholder="Select Control Test for Linking" />
              </SelectTrigger>
              <SelectContent>
                {controlTests.map((test) => (
                  <SelectItem key={test.id} value={test.id}>
                    {test.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading evidence...</div>
        ) : evidenceList.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No evidence uploaded yet
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evidenceList.map((evidence) => (
                  <TableRow key={evidence.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getFileTypeIcon()}
                        {evidence.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {evidence.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      {evidence.tags && (
                        <div className="flex gap-1 flex-wrap">
                          {evidence.tags.split(',').map((tag, index) => (
                            <Badge key={index} variant="secondary">
                              {tag.trim()}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(evidence.created_at)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => linkToControlTest(evidence.id)}
                          disabled={!selectedControlTest}
                        >
                          <Link className="h-3 w-3 mr-1" />
                          Link
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a
                            href={`${API_BASE_URL}${evidence.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
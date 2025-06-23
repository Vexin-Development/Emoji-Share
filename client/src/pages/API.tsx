import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Download, Zap, Clock, ExternalLink } from "lucide-react";

export default function API() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-discord-gradient">
          Developer API
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Integrate Discord Emoji Hub into your applications with our comprehensive REST API.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* API Endpoints */}
        <div className="lg:col-span-2">
          <Card className="bg-surface border-border p-8">
            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center">
              <Code className="mr-2 h-6 w-6" />
              REST API Endpoints
            </h2>

            {/* Get Stats */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground">Get Statistics</h3>
                <Badge className="bg-green-500/20 text-green-400 border-green-400">GET</Badge>
              </div>
              <code className="block bg-background rounded-lg p-4 text-cyan-400 font-mono text-sm mb-3 overflow-x-auto">
                GET /api/stats
              </code>
              <p className="text-muted-foreground text-sm">
                Returns real-time platform statistics including total emojis, downloads, likes, and last upload time.
              </p>
            </div>

            {/* Get Emojis */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground">List Emojis</h3>
                <Badge className="bg-green-500/20 text-green-400 border-green-400">GET</Badge>
              </div>
              <code className="block bg-background rounded-lg p-4 text-cyan-400 font-mono text-sm mb-3 overflow-x-auto">
                GET /api/emojis?page=1&limit=20&category=animated&sort=newest
              </code>
              <p className="text-muted-foreground text-sm">
                Retrieve a paginated list of emojis with optional filtering and sorting.
              </p>
            </div>

            {/* Get Single Emoji */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground">Get Emoji</h3>
                <Badge className="bg-green-500/20 text-green-400 border-green-400">GET</Badge>
              </div>
              <code className="block bg-background rounded-lg p-4 text-cyan-400 font-mono text-sm mb-3 overflow-x-auto">
                GET /api/emoji/:id
              </code>
              <p className="text-muted-foreground text-sm">
                Fetch detailed information about a specific emoji by its ID.
              </p>
            </div>

            {/* Upload Emoji */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground">Upload Emoji</h3>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-400">POST</Badge>
              </div>
              <code className="block bg-background rounded-lg p-4 text-cyan-400 font-mono text-sm mb-3 overflow-x-auto">
                POST /api/upload
              </code>
              <p className="text-muted-foreground text-sm">
                Upload a new emoji with multipart/form-data. Requires file, name, and optional category/tags.
              </p>
            </div>

            {/* Like Emoji */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground">Like Emoji</h3>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-400">POST</Badge>
              </div>
              <code className="block bg-background rounded-lg p-4 text-cyan-400 font-mono text-sm mb-3 overflow-x-auto">
                POST /api/like/:id
              </code>
              <p className="text-muted-foreground text-sm">
                Like an emoji. Includes rate limiting per IP to prevent spam.
              </p>
            </div>

            {/* Download Emoji */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground">Download Emoji</h3>
                <Badge className="bg-green-500/20 text-green-400 border-green-400">GET</Badge>
              </div>
              <code className="block bg-background rounded-lg p-4 text-cyan-400 font-mono text-sm mb-3 overflow-x-auto">
                GET /api/emoji/:id/file
              </code>
              <p className="text-muted-foreground text-sm">
                Download the raw image file for an emoji. Increments download counter.
              </p>
            </div>
          </Card>
        </div>

        {/* SDKs and Tools */}
        <div>
          <Card className="bg-surface border-border p-6 mb-6">
            <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
              <Download className="mr-2 h-5 w-5" />
              Official SDKs
            </h3>
            <div className="space-y-4">
              <Card className="bg-background/50 border-border p-4">
                <h4 className="font-semibold text-foreground mb-2">JavaScript SDK</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Full TypeScript support with Promise-based API
                </p>
                <code className="text-xs text-cyan-400 bg-background rounded px-2 py-1">
                  npm install discord-emoji-hub
                </code>
              </Card>
              <Card className="bg-background/50 border-border p-4">
                <h4 className="font-semibold text-foreground mb-2">Python SDK</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Async/await support with type hints
                </p>
                <code className="text-xs text-cyan-400 bg-background rounded px-2 py-1">
                  pip install discord-emoji-hub
                </code>
              </Card>
            </div>
          </Card>

          <Card className="bg-surface border-border p-6">
            <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Rate Limits
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Upload:</span>
                <Badge variant="outline">5 per minute</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Like:</span>
                <Badge variant="outline">10 per minute</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Download:</span>
                <Badge variant="outline">100 per minute</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">General API:</span>
                <Badge variant="outline">60 per minute</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Code Examples */}
      <Card className="mt-12 bg-surface border-border p-8">
        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center">
          <Zap className="mr-2 h-6 w-6" />
          Code Examples
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* JavaScript Example */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">JavaScript</h3>
            <Card className="bg-background border-border p-4 overflow-x-auto">
              <pre className="text-sm text-muted-foreground">
                <code>{`const EmojiHub = require('discord-emoji-hub');

const client = new EmojiHub();

// Get all emojis
const emojis = await client.listEmojis({
  category: 'animated',
  limit: 50
});

// Upload emoji
const result = await client.uploadEmoji({
  file: './my-emoji.png',
  name: 'awesome_emoji',
  category: 'reaction'
});

// Download emoji
const blob = await client.downloadEmoji('000123');`}</code>
              </pre>
            </Card>
          </div>

          {/* Python Example */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Python</h3>
            <Card className="bg-background border-border p-4 overflow-x-auto">
              <pre className="text-sm text-muted-foreground">
                <code>{`import discord_emoji_hub as eh

client = eh.Client()

# Get all emojis
emojis = await client.list_emojis(
    category='animated',
    limit=50
)

# Upload emoji
result = await client.upload_emoji(
    file_path='./my-emoji.png',
    name='awesome_emoji',
    category='reaction'
)

# Download emoji
data = await client.download_emoji('000123')`}</code>
              </pre>
            </Card>
          </div>
        </div>

        {/* API Response Examples */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-foreground mb-3">Response Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Stats Response</h4>
              <Card className="bg-background border-border p-4 overflow-x-auto">
                <pre className="text-xs text-muted-foreground">
                  <code>{`{
  "totalEmojis": 42586,
  "totalDownloads": 1234567,
  "totalLikes": 89234,
  "lastUploadTime": "2m ago"
}`}</code>
                </pre>
              </Card>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Emoji Response</h4>
              <Card className="bg-background border-border p-4 overflow-x-auto">
                <pre className="text-xs text-muted-foreground">
                  <code>{`{
  "id": "000123",
  "name": "awesome_emoji",
  "category": "reaction",
  "tags": ["fun", "reaction"],
  "likes": 42,
  "downloads": 156,
  "width": 128,
  "height": 128,
  "fileSize": 45612,
  "uploadedAt": "2024-01-15T..."
}`}</code>
                </pre>
              </Card>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

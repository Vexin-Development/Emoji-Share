import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Upload, Search, Shield, HelpCircle, Zap } from "lucide-react";

export default function Docs() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-discord-gradient">
          Documentation
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know about using Discord Emoji Hub.
        </p>
      </div>

      <Card className="bg-surface border-border p-8">
        <div className="prose prose-invert max-w-none">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
              <BookOpen className="mr-2 h-6 w-6" />
              Getting Started
            </h2>
            <p className="text-muted-foreground mb-6">
              Welcome to Discord Emoji Hub! This guide will help you get started with uploading, 
              browsing, and using emojis from our platform.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Upload className="mr-2 h-5 w-5" />
              Uploading Emojis
            </h3>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-green-400 border-green-400">✓</Badge>
                <span>Supported formats: PNG, GIF, APNG</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-green-400 border-green-400">✓</Badge>
                <span>Maximum file size: 256 KB</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-green-400 border-green-400">✓</Badge>
                <span>Maximum dimensions: 250×250 pixels</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-red-400 border-red-400">✗</Badge>
                <span>No explicit, hateful, or copyrighted content</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Zap className="mr-2 h-5 w-5" />
              Adding Emojis to Discord
            </h3>
            <ol className="text-muted-foreground space-y-2">
              <li className="flex items-start space-x-2">
                <Badge variant="secondary" className="mt-0.5 text-xs">1</Badge>
                <span>Download the emoji from our platform</span>
              </li>
              <li className="flex items-start space-x-2">
                <Badge variant="secondary" className="mt-0.5 text-xs">2</Badge>
                <span>Open Discord and go to Server Settings</span>
              </li>
              <li className="flex items-start space-x-2">
                <Badge variant="secondary" className="mt-0.5 text-xs">3</Badge>
                <span>Navigate to "Emoji" in the sidebar</span>
              </li>
              <li className="flex items-start space-x-2">
                <Badge variant="secondary" className="mt-0.5 text-xs">4</Badge>
                <span>Click "Upload Emoji" and select your downloaded file</span>
              </li>
              <li className="flex items-start space-x-2">
                <Badge variant="secondary" className="mt-0.5 text-xs">5</Badge>
                <span>Give your emoji a name and save</span>
              </li>
            </ol>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Search and Filters
            </h3>
            <p className="text-muted-foreground mb-4">
              Use our advanced search and filtering system to find the perfect emoji:
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span>Search by name or tags</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span>Filter by category (Animated, Static, Reaction, etc.)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span>Sort by newest, most liked, or most downloaded</span>
              </li>
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Community Guidelines
            </h3>
            <p className="text-muted-foreground mb-4">
              To maintain a safe and enjoyable platform for everyone:
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span>Be respectful and considerate</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span>Only upload original content or content you have permission to use</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span>Report inappropriate content using the report button</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span>Help others by liking quality emojis</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <HelpCircle className="mr-2 h-5 w-5" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              <Card className="bg-background/50 border-border p-4">
                <h4 className="font-semibold text-foreground mb-2">
                  Can I upload animated emojis?
                </h4>
                <p className="text-muted-foreground text-sm">
                  Yes! We support GIF and APNG formats for animated emojis.
                </p>
              </Card>
              
              <Card className="bg-background/50 border-border p-4">
                <h4 className="font-semibold text-foreground mb-2">
                  How do I delete an emoji I uploaded?
                </h4>
                <p className="text-muted-foreground text-sm">
                  Currently, emoji deletion is handled by our moderation team. 
                  Please contact us if you need an emoji removed.
                </p>
              </Card>
              
              <Card className="bg-background/50 border-border p-4">
                <h4 className="font-semibold text-foreground mb-2">
                  Is there a limit to how many emojis I can upload?
                </h4>
                <p className="text-muted-foreground text-sm">
                  There's a rate limit of 5 uploads per minute to prevent spam, but no daily limit.
                </p>
              </Card>
              
              <Card className="bg-background/50 border-border p-4">
                <h4 className="font-semibold text-foreground mb-2">
                  Why was my emoji rejected?
                </h4>
                <p className="text-muted-foreground text-sm">
                  Emojis may be rejected for violating our guidelines, having inappropriate content, 
                  or not meeting technical requirements (file size, dimensions, format).
                </p>
              </Card>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

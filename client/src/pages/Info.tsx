import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, MessageCircle, Users, Code, Shield, Star, ExternalLink } from "lucide-react";

export default function Info() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-discord-gradient">
          About Us
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Learn more about the team behind Discord Emoji Hub and our mission.
        </p>
      </div>

      <Card className="bg-surface border-border p-8 mb-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">Owned by Vexing Development</h2>
          <p className="text-lg text-muted-foreground">
            Building the future of Discord community tools and open-source software.
          </p>
        </div>

        {/* Team Member */}
        <Card className="bg-background/50 border-border p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Profile image placeholder */}
            <div className="w-24 h-24 discord-gradient rounded-full flex items-center justify-center text-3xl font-bold text-white">
              U
            </div>
            <div className="text-center md:text-left flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Brought to you by{" "}
                <a 
                  href="https://github.com/TheUselessCreator" 
                  className="text-primary hover:text-cyan-400 transition-colors duration-200 inline-flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Useless
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </h3>
              <p className="text-muted-foreground mb-4">
                Lead developer and creator of Discord Emoji Hub. Passionate about open-source 
                software and community-driven projects.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <Badge className="bg-primary/20 text-primary border-primary">
                  Full Stack Developer
                </Badge>
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-400">
                  Open Source Advocate
                </Badge>
                <Badge className="bg-green-500/20 text-green-400 border-green-400">
                  Community Builder
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Community Links */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-6">Join Our Community</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              asChild
              variant="outline"
              size="lg"
              className="bg-background/50 border-border hover:bg-background/70 group"
            >
              <a 
                href="https://github.com/Vexin-Development" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3"
              >
                <Github className="h-5 w-5 group-hover:animate-pulse" />
                <span>Star on GitHub</span>
              </a>
            </Button>
            <Button 
              asChild
              size="lg"
              className="discord-gradient text-white group"
            >
              <a 
                href="https://dsc.gg/vexin" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3"
              >
                <MessageCircle className="h-5 w-5 group-hover:animate-bounce" />
                <span>Join Discord</span>
              </a>
            </Button>
          </div>
        </div>


      </Card>

      {/* Mission Statement */}
      <Card className="bg-surface border-border p-8">
        <h3 className="text-2xl font-bold text-primary mb-4">Our Mission</h3>
        <p className="text-muted-foreground mb-6">
          At Discord Emoji Hub, we believe in the power of community-driven content creation. 
          Our platform provides a safe, easy-to-use space where creators can share their emoji 
          designs with Discord communities worldwide.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">
              <Users className="h-10 w-10 text-primary mx-auto" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Community First</h4>
            <p className="text-sm text-muted-foreground">Built by the community, for the community</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">
              <Code className="h-10 w-10 text-cyan-400 mx-auto" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Open Source</h4>
            <p className="text-sm text-muted-foreground">Transparent, collaborative development</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">
              <Shield className="h-10 w-10 text-green-400 mx-auto" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Safe & Secure</h4>
            <p className="text-sm text-muted-foreground">AI-powered moderation and content safety</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

"use client";

import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  Users, 
  Award, 
  Sparkles,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Smartphone,
  Globe,
  Shield
} from "lucide-react";

const WHATSAPP_NUMBER = "260968570833";

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Quality First",
      description: "We source only genuine, factory-sealed devices so every gadget meets our high standards."
    },
    {
      icon: Users,
      title: "Everyone Welcome",
      description: "Phones, tablets and computers for everyone — students, professionals, creators and families."
    },
    {
      icon: Award,
      title: "Fair Pricing",
      description: "Latest tech at honest Kwacha prices. Premium gadgets shouldn't cost a premium to reach you."
    },
    {
      icon: Globe,
      title: "Nationwide Delivery",
      description: "Reliable delivery across Zambia, with genuine warranties and after-sales support you can trust."
    }
  ];

  const stats = [
    { number: "500+", label: "Products" },
    { number: "10K+", label: "Happy Customers" },
    { number: "3", label: "Categories" },
    { number: "100%", label: "Satisfaction" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-amber-100 blur-3xl" />
            <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-rose-100 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-100 blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="outline" className="mb-6 bg-white/50 backdrop-blur">
                <Sparkles className="mr-1 h-3 w-3" />
                Our Story
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                About{" "}
                <span className="bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-500 bg-clip-text text-transparent">
                  TwendaChina
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                We believe great technology should be within everyone's reach. Since our founding,
                TwendaChina has been dedicated to bringing genuine phones, tablets and computers
                to homes across Zambia. Our curated gadgets are chosen to keep you connected,
                productive and entertained.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-neutral-900 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</p>
                  <p className="text-neutral-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">What We Stand For</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">Our Values</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-8 pb-6 px-6">
                    <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-7 w-7 text-neutral-700" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-neutral-50 to-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="outline" className="mb-4">Our Journey</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  From a Spark to Your Doorstep
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    TwendaChina started with a simple idea: the latest technology should be
                    accessible to everyone in Zambia. We noticed people struggled to find genuine
                    phones, tablets and computers from brands they trust, and we knew there was a better way.
                  </p>
                  <p>
                    Today, we offer carefully curated phones, tablets and computers, all in one
                    place. Each device is selected with care, ensuring it meets our standards for
                    authenticity, performance, and value.
                  </p>
                  <p>
                    We're not just selling gadgets — we're helping you stay connected, work
                    smarter and enjoy the tech you love. That's the TwendaChina difference.
                  </p>
                </div>
                <Button className="mt-6 bg-green-600 hover:bg-green-700" asChild>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Get in Touch
                  </a>
                </Button>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-neutral-200 to-neutral-300 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <Smartphone className="h-16 w-16 text-neutral-700" />
                      </div>
                      <p className="text-neutral-600 font-medium">Est. 2024</p>
                    </div>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-amber-200/50 blur-xl" />
                <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-rose-200/50 blur-xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Preview */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Shop By Category</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">Tech for Everyone</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Phones Card */}
              <Card className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image
                    src="/images/electronics/phone-1.jpg"
                    alt="Phones collection"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" asChild>
                      <a href="/phones">Shop Phones</a>
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">Phones</h3>
                  <p className="text-sm text-muted-foreground">Flagship smartphones from Apple, Samsung & Google</p>
                </CardContent>
              </Card>

              {/* Tablets Card */}
              <Card className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image
                    src="/images/electronics/tablet-1.jpg"
                    alt="Tablets collection"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" asChild>
                      <a href="/tablets">Shop Tablets</a>
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">Tablets</h3>
                  <p className="text-sm text-muted-foreground">iPads and Android tablets for work and play</p>
                </CardContent>
              </Card>

              {/* Computers Card */}
              <Card className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image
                    src="/images/electronics/computer-1.jpg"
                    alt="Computers collection"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" asChild>
                      <a href="/computers">Shop Computers</a>
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">Computers</h3>
                  <p className="text-sm text-muted-foreground">MacBooks, ultrabooks and gaming laptops</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 md:py-24 bg-neutral-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="outline" className="mb-4 border-neutral-700 text-neutral-300">
              Get In Touch
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              We'd Love to Hear From You
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto mb-8">
              Have questions about a device or need buying advice?
              Our team is here to help. Reach out to us anytime!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto" asChild>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp Us
                </a>
              </Button>
              <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
                <Button size="lg" variant="outline" className="border-neutral-700 text-white hover:bg-neutral-800" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-5 w-5" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-neutral-700 text-white hover:bg-neutral-800" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-5 w-5" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-neutral-700 text-white hover:bg-neutral-800" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer whatsappNumber={WHATSAPP_NUMBER} />
    </div>
  );
}

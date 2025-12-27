import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { 
  Home, 
  Info, 
  Wrench, 
  FileText, 
  Users, 
  Building, 
  FolderOpen, 
  Camera, 
  BookOpen, 
  Mail,
  Briefcase,
  Search
} from "lucide-react";

interface SearchItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  keywords: string[];
  category: string;
}

const searchItems: SearchItem[] = [
  {
    title: "Home",
    path: "/",
    icon: <Home className="h-4 w-4" />,
    keywords: ["home", "main", "landing"],
    category: "Pages"
  },
  {
    title: "About Us",
    path: "/about",
    icon: <Info className="h-4 w-4" />,
    keywords: ["about", "company", "who we are", "history"],
    category: "Pages"
  },
  {
    title: "Services",
    path: "/services",
    icon: <Wrench className="h-4 w-4" />,
    keywords: ["services", "solutions", "what we do", "network", "wifi"],
    category: "Pages"
  },
  {
    title: "AMC Plans",
    path: "/amc-plans",
    icon: <FileText className="h-4 w-4" />,
    keywords: ["amc", "maintenance", "plans", "contract", "annual", "support"],
    category: "Pages"
  },
  {
    title: "Our Team",
    path: "/our-team",
    icon: <Users className="h-4 w-4" />,
    keywords: ["team", "staff", "employees", "people"],
    category: "Pages"
  },
  {
    title: "Our Clients",
    path: "/our-clients",
    icon: <Building className="h-4 w-4" />,
    keywords: ["clients", "customers", "testimonials", "reviews"],
    category: "Pages"
  },
  {
    title: "Projects",
    path: "/projects",
    icon: <FolderOpen className="h-4 w-4" />,
    keywords: ["projects", "work", "portfolio", "installations"],
    category: "Pages"
  },
  {
    title: "CCTV Solutions",
    path: "/stallion-cctv",
    icon: <Camera className="h-4 w-4" />,
    keywords: ["cctv", "camera", "surveillance", "security", "monitoring"],
    category: "Services"
  },
  {
    title: "CCTV AMC",
    path: "/cctv-amc",
    icon: <Camera className="h-4 w-4" />,
    keywords: ["cctv amc", "camera maintenance", "surveillance contract"],
    category: "Services"
  },
  {
    title: "Blog",
    path: "/blog",
    icon: <BookOpen className="h-4 w-4" />,
    keywords: ["blog", "articles", "news", "updates"],
    category: "Pages"
  },
  {
    title: "Contact Us",
    path: "/contact",
    icon: <Mail className="h-4 w-4" />,
    keywords: ["contact", "reach", "email", "phone", "address", "book audit"],
    category: "Pages"
  },
  {
    title: "Careers",
    path: "/careers",
    icon: <Briefcase className="h-4 w-4" />,
    keywords: ["careers", "jobs", "openings", "work with us", "hiring"],
    category: "Pages"
  }
];

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredItems = searchItems.filter((item) => {
    const searchLower = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchLower) ||
      item.keywords.some((keyword) => keyword.includes(searchLower))
    );
  });

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SearchItem[]>);

  const handleSelect = (path: string) => {
    navigate(path);
    onOpenChange(false);
    setSearch("");
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search pages, services..." 
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {Object.entries(groupedItems).map(([category, items]) => (
          <CommandGroup key={category} heading={category}>
            {items.map((item) => (
              <CommandItem
                key={item.path}
                onSelect={() => handleSelect(item.path)}
                className="flex items-center gap-2 cursor-pointer"
              >
                {item.icon}
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
};

export default SearchDialog;

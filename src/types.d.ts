export interface ArtList {
 id: number;
 title: {
  rendered: string;
 };
 acf: {
  name: string;
  slug: string;
  title: string;
  country: string;
  carouselImage: string;
  carouselImage_sp: string;
  flag: string;
  scene01?: string;
  scene02?: string;
  scene03?: string;
  profilePhoto: string;
  profile?: string;
  aboutCountry?: string;
  instagram?: string;
  website?: string;
  map: string;
  description?: string;
 };
}

export interface CarouselProps {
 loaded: boolean
 page: string
 artList: ArtList[];
}

export interface CarouselItemProps {
 key: number
 i: number
 width: number
 height: number
 art: ArtList
 // url: string
 scrollRef: any
 setActivePlane: React.Dispatch<React.SetStateAction<number | null>>
 activePlane: number | null
 anyPlaneActive: boolean
 blockEvents: boolean
 setBlockEvents: React.Dispatch<React.SetStateAction<boolean>>
}
export interface PlaneProps {
 // i: number
 width: number
 height: number
 art: ArtList
 // url: string
 scrollRef: any
 active: boolean
 opacity: number
 blockEvents: boolean
}
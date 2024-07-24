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
  carouselImageSp: string;
  showInCarousel: boolean;
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

export interface AboutData {
 introduction_title: string
 introduction_english: string
 introduction_japanese: string
 introduction_image: string
 details_title: string
 details_english: string
 details_japanese: string
 about_title: string
 about_english: string
 about_japanese: string
 onten_title: string
 onten_english: string
 onten_japanese: string
 onten_image_01: string
 onten_image_02: string
 ondo_works_lenght: number
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
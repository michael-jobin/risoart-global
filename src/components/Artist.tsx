const Artist = ({ name }: { name: string }) => {
  return (
    <p className="artist">
      <span>Artist</span>
      <em>{name}</em>
    </p>
  )
}

export default Artist

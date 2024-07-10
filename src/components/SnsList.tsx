const SnsList = ({ instagram, website }: { instagram?: string; website?: string }) => {
  return (
    <div className="snsList">
      {website && (
        <a href={website} target="_blank" rel="noreferrer">
          <img
            src="/global/assets/images/common/logo_website.png"
            alt="Website"
            width="23"
            height="23"
          />
        </a>
      )}
      {instagram && (
        <a href={instagram} target="_blank" rel="noreferrer">
          <img
            src="/global/assets/images/common/logo_instagram.svg"
            alt="Instagram"
            width="23"
            height="23"
          />
        </a>
      )}
    </div>
  )
}

export default SnsList

const Photos = ({conversation}) => {
    return (
        <div style={{margin: '20px', overflowY: 'auto'}}>
            <h3>Photos</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '30px', marginTop: '20px'}}>
                {conversation.map((image) => {
                    if (image.url) {
                        return image.url.map((url, idx) => (
                        <img key={idx} src={url} style={{ width: '100%', height: 'auto' }} />
                        ));
                    }
                return null;
                })}
            </div>
        </div>
    );
}

export default Photos;
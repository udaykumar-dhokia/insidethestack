import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const hasTitle = searchParams.has('title');
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 120)
      : 'InsideTheStack | How Modern Software Works';
    
    const hasCategory = searchParams.has('category');
    const category = hasCategory ? searchParams.get('category') : '';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#0a0a0a', // Dark theme background
            padding: '80px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Logo / Brand Name */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              color: '#ffffff',
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            <div style={{ display: 'flex', color: '#3b82f6', marginRight: '8px' }}>Inside</div>
            <div style={{ display: 'flex', color: '#ffffff' }}>TheStack</div>
          </div>

          {/* Article Info */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            {category && (
              <div
                style={{
                  color: '#3b82f6',
                  fontSize: 28,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '20px',
                }}
              >
                {category}
              </div>
            )}
            <div
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.1,
                letterSpacing: '-0.04em',
                maxWidth: '900px',
              }}
            >
              {title}
            </div>
          </div>
          
          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div
              style={{
                color: '#a1a1aa', // muted-foreground equivalent
                fontSize: 28,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              udaykumar-dhokia.github.io/insidethestack
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}

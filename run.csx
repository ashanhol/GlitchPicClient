#r "Newtonsoft.Json"
#r "System.Drawing"
#r "System.IO"

using System;
using System.Net;
using Newtonsoft.Json;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Diagnostics;

public static async Task<object> Run(HttpRequestMessage req, TraceWriter log)
{
    log.Info($"Webhook was triggered!");

	var message = await req.Content.ReadAsStringAsync();
    var jsonContent = JsonConvert.DeserializeObject<PictureJson>(message);

    string b64pic = jsonContent.base64Picture; 
    string b64picedit;
    int glitchType = jsonContent.type;
    Bitmap i; 

    //dynamic data = JsonConvert.DeserializeObject(jsonContent);

    if (jsonContent.base64Picture == null) {
        return req.CreateResponse(HttpStatusCode.BadRequest, new {
            error = "Please pass glitch type and a base64 picture string in the input object"
        });
    }else{
        // Convert base 64 string to byte[]
        byte[] imageBytes = Convert.FromBase64String(b64pic);

        // Convert byte[] to Image
        using (var ms = new MemoryStream(imageBytes, 0, imageBytes.Length))
        {
            i = (Bitmap) Bitmap.FromStream(ms, true);

        }

        //glitchtype 1 = colorglitch, 2 = colorswap, 3 = noise, 4 = bars
        int roffset, goffset, boffset; 
        roffset = goffset = boffset = 0;
        //1
        if(glitchType==1) roffset = goffset = boffset = GetRandomNumber(5)+1;
        //2
        else if(glitchType == 2){
            switch (GetRandomNumber(4))
                {
                    case 0:
                        roffset = GetRandomNumber(3);
                        goffset = GetRandomNumber(3); 
                        boffset = GetRandomNumber(7);
                        log.Info("case 0");
                        break;
                    case 1:
                        roffset = GetRandomNumber(7);
                        goffset = GetRandomNumber(3); 
                        boffset = GetRandomNumber(3);
                        log.Info("case 1");
                        break;
                    case 2: 
                        roffset = GetRandomNumber(3);
                        goffset = GetRandomNumber(7); 
                        boffset = GetRandomNumber(3);
                        log.Info("case 2");
                        break;
                    default:
                        roffset = GetRandomNumber(7);
                        goffset = GetRandomNumber(7); 
                        boffset = GetRandomNumber(7);
                        log.Info("case default");
                        break;
                }
            log.Info("r: "+ roffset + " g: " + goffset + " b: " + boffset);
        }
        
        for (int x = 0; x < i.Width; x++)
        {
            //4
            if(glitchType==4) roffset = goffset = boffset = GetRandomNumber(32);
            
            for (int y = 0; y < i.Height; y++)
            {
                //3 
                if(glitchType==3){
                    int rando = GetRandomNumber(32);
                    roffset = rando;
                    goffset = rando;
                    boffset = rando;
                } 
                
                Color pixelColor = i.GetPixel(x, y);
                Color newColor = Color.FromArgb((pixelColor.R<< roffset) & 0xff, (pixelColor.G<< goffset) & 0xff, (pixelColor.B<< boffset) & 0xff);
                i.SetPixel(x, y, newColor);
            }
                    
        }
        //convert back to base 64 string
        using (var sm = new MemoryStream())
        {
            // Convert Image to byte[]
            i.Save(sm, ImageFormat.Jpeg);
            byte[] byteImage = sm.ToArray();

            // Convert byte[] to base 64 string
            b64picedit = Convert.ToBase64String(byteImage).Insert(0,"data:image/jpeg;base64,");
        }


    }

    return req.CreateResponse(HttpStatusCode.OK, new {
        Type = glitchType, 
        base64Picture = b64picedit
    });
}


class PictureJson
{
	public int type { get; set; }
    public string base64Picture { get; set; }
}
private static readonly Random getrandom = new Random();
private static readonly object syncLock = new object();
public static int GetRandomNumber(int n)
{
    lock(syncLock) 
    { // synchronize
        return getrandom.Next(n);
    }
}

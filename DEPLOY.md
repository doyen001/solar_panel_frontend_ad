# Deploying easylink-solar-ad

This project follows the same CodeDeploy pattern as `20260314-solar-panel`
(the main frontend) and `20260314-solar-panel-backend`, on the **same EC2
instance**, alongside them:

| App                    | Path                              | Port | pm2 name              |
| ----------------------- | ---------------------------------- | ---- | ---------------------- |
| Frontend                | `/home/ubuntu/easylink-solar/web`    | 3000 | `easylink-solar`        |
| Backend                 | `/home/ubuntu/easylink-solar/server` | 3001 | `easylink-solar-server` |
| **Ad site (this repo)** | `/home/ubuntu/easylink-solar/ad`     | 3002 | `easylink-solar-ad`     |

`appspec.yml`, `buildspec.yml`, and `scripts/*.sh` mirror the frontend's
setup exactly, just pointed at the `ad` path/pm2 name/port. They're ready to
use, but three things still need doing outside this repo — none of them
were possible from this session (no AWS API access to the account that owns
this instance, only SSH):

1. **Create the CodeDeploy application + deployment group** ("easylink-solar-ad"),
   targeting the same instance/tag the other two use, and wire it into
   CodeBuild/CodePipeline (or whatever triggers deploys for the other apps).
2. **Point DNS for `easylinkplus.com` (and `www`) at the instance's public IP.**
3. **nginx + SSL**: `deploy/nginx/easylinkplus.com.conf` is a ready-to-drop-in
   server block proxying to port 3002. Once DNS resolves, copy it to
   `/etc/nginx/sites-available/` on the instance, symlink it into
   `sites-enabled/`, reload nginx, then run
   `sudo certbot --nginx -d easylinkplus.com -d www.easylinkplus.com`
   (certbot will rewrite the file in place with the SSL block and the
   HTTP→HTTPS redirect, same as it did for `easylinksolar.com.au`).

Until DNS/nginx are set up, the app will still run and be reachable at
`http://<instance-ip>:3002` once deployed (make sure the instance's security
group allows inbound 3002, or just rely on the nginx proxy once configured).

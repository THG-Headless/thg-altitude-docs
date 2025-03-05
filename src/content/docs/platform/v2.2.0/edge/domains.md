---
title: Custom Domains
---

If you own a domain and want to associate it with your environment, you can easily set up custom domains by following these steps.

## 1. Access the `Domains` Tab

First, navigate to the `Domains` tab on your site's dashboard.

![Domains Tab](/statics/screenshots/custom_domains/domain-tab-empty.png)

## 2. Add Your Domain

Input the domain you wish to associate and choose the environment for this domain.

![Add Domain](/statics/screenshots/custom_domains/domain-add-modal.png)

## 3. Deploy Your Site

In order for your site to go live on the specified domain, you'll need to perform a new deployment. A prompt will appear after adding the domain, where a new deployment can be triggered.

![Invalid Domain](/statics/screenshots/custom_domains/domain-invalid.png)

## 4. DNS Configuration

After deploying your site, follow the instructions provided for the domain record you just added. You have two options:

### a. CNAME
Copy the provided value and create a CNAME record with your DNS provider using this value and your chosen domain. Once the DNS record is confirmed, the domain's status will change to `Configuration Valid`.

![Valid Domain CNAME](/statics/screenshots/custom_domains/domain-valid-cname.png)

### b. A records
Copy each of the provided IPs and create four A records with your DNS provider. Once this is confirmed, the domain's status will change to `Configuration Valid`.

![Valid Domain A records](/statics/screenshots/custom_domains/domain-valid-arecords.png)

## 5. TLS Subscription

If the DNS is active, all you need to do for the TLS subscription is to deploy. If that is not the case, you need to create a CNAME for the shown record and point it to the ACME challenge. Once that is done, the TLS subscription status will change to `TLS Subscription Valid` and will also show the expiration date.

![Valid TLS Subscription](/statics/screenshots/custom_domains/tls-subscription.png)

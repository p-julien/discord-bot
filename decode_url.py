import requests

class DecodeUrl:

    def get_mime_type_from_url(self, url):
        try:
            return requests.Session().head(url, allow_redirects=True).headers['content-type']
        except Exception:
            return "application/octet-stream"

    def get_file_size_from_url(self, url):
        try:
            return requests.Session().head(url, allow_redirects=True).headers['content-length']
        except Exception:
            return 9999999

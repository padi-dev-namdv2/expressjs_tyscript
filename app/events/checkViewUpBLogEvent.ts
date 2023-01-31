import {EventSubscriber, On} from "event-dispatch";
import { Blog } from "../../models";
import { Session } from "routing-controllers";

@EventSubscriber()
export class UserEventSubscriber {
    @On("checkUpViewSession")
    checkUpViewSession(data: any) {
        var blog: Blog = data.blog;
        var sessionKey: string = 'user_' + data.user.id + 'view_blog_' + blog.id;
        if (data.session.sessionKey) {
            data.session.cookie.expires = new Date(Date.now() + 60000);
        } else {
            blog.count_view = ++ blog.count_view;
            blog.save();
            data.session.sessionKey = {
                expires: true
            };

            data.session.cookie.expires = new Date(Date.now() + 50000);
        }
    }
}
import { exec } from "child_process";

export async function setup(
  playbook: string,
  options: {
    repo_url: string;
    dest: string;
    site_dir: string;
    build_dir_name: string;
    become_password: string;
    domain: string;
  }
): Promise<{ success: boolean; payload: string }> {
  return new Promise((resolve, rejects) => {
    let success = false;
    let payload: string = "";
    const command = `ansible-playbook -e  \
                  "repo_url=${options.repo_url} \
                   dest=${options.dest} \
                   site_dir=${options.site_dir} \
                   build_dir_name=${options.build_dir_name} \
                   site_conf_dir=/sites/conf \
                   document_root=/dr \
                   server_name=${options.domain} \
                   port=80
                   " ${playbook} --extra-vars ansible-become-pass=${options.become_password}`;

    const child_command = exec(command);

    child_command.stdout?.on("data", (data) => {
      payload += data;
      console.log(data);
    });

    child_command.stderr?.on("data", (data) => {
      payload += data;
      console.log(data);
    });

    child_command.on("close", function (code) {
      if (code === 0) {
        success = true;
      } else {
        rejects({ success, payload: JSON.stringify(payload) });
      }

      resolve({ success, payload: JSON.stringify(payload) });
    });
  });
}

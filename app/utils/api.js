import axios from 'axios';

export const getOrgStructure = () => {
  const organizationPromise = new Promise((resolve, reject) => {
    Promise.
        all([getOrganizations(), getGroups(), getRooftops()]).
        then(([organizations, groups, rooftops]) => {
          resolve(buildOrgStructure(organizations, groups, rooftops));
        }).
        catch((err) => reject(err));
  });
  return organizationPromise;
};

export const getOrganizations = () => {
  const organizationPromise = new Promise((resolve, reject) => {
    axios.get(process.env.ORGANIZATIONS_SOURCE).
        then(({data}) => resolve(data)).
        catch((err) => reject(err));
  });
  return organizationPromise;
};

export const getGroups = () => {
  const groupPromise = new Promise((resolve, reject) => {
    axios.get(process.env.GROUPS_SOURCE).
        then(({data}) => resolve(data)).
        catch((err) => reject(err));
  });
  return groupPromise;
};

export const getRooftops = () => {
  const rooftopPromise = new Promise((resolve, reject) => {
    axios.get(process.env.ROOFTOPS_SOURCE).
        then(({data}) => resolve(data)).
        catch((err) => reject(err));
  });
  return rooftopPromise;
};

const buildOrgStructure = (organizations, groups, rooftops) => {
  return associateParents(
      organizations,
      associateParents(
          groups,
          rooftops,
          'rooftops',
          'group_id',
      ),
      'groups',
      'organization_id',
  );
};

const associateParents = (
    parents,
    children,
    association = 'children',
    foreignKey = 'parent_id',
    primaryKey = 'id',
) => {
  return parents.map((parent) => {
    const parentChildren =
        children.filter((child) => child[foreignKey] === parent[primaryKey]);

    return {[association]: parentChildren, ...parent};
  });
};
